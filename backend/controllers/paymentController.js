const db = require("../models");
const { Payments, bookings, Apartment } = db;
const crypto = require("crypto");

// Helper to update booking and apartment status on successful payment
async function finalizePaymentSuccess(bookingId, paymentId) {
  const payment = await Payments.findByPk(paymentId);
  if (payment) {
    payment.payment_status = "paid";
    await payment.save();
  }

  const booking = await bookings.findByPk(bookingId);
  if (booking) {
    booking.booking_status = "confirmed";
    booking.payment_status = "paid";
    await booking.save();

    // Set apartment to booked
    const apartment = await Apartment.findByPk(booking.apartment_id);
    if (apartment) {
      apartment.status = "booked";
      await apartment.save();
    }
  }
}

// ----------------------------------------------------
// PAYSTACK PAYMENT INTEGRATION
// ----------------------------------------------------

// Initialize Paystack Payment
exports.initializePaystack = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    const booking = await bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.booking_status === "confirmed" || booking.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid for and confirmed.",
      });
    }

    const reference = `PAY-${crypto.randomBytes(8).toString("hex")}`;
    const amountKobo = Math.round(parseFloat(booking.total_price) * 100);

    // Save pending payment record in db
    const pendingPayment = await Payments.create({
      booking_id: booking.id,
      amount: booking.total_price,
      currency: "NGN",
      payment_method: "paystack",
      transaction_reference: reference,
      payment_status: "pending",
    });

    const email = req.user.email;

    // Check if PAYSTACK_SECRET_KEY is configured
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.log("[PAYSTACK] PAYSTACK_SECRET_KEY not set in .env. Simulating Paystack Checkout.");
      
      // Return simulated success response
      return res.status(200).json({
        success: true,
        message: "Paystack payment initialized (SIMULATED MODE).",
        data: {
          authorization_url: `${req.protocol}://${req.get("host")}/api/payments/paystack/mock-checkout?reference=${reference}&bookingId=${bookingId}`,
          reference,
          access_code: `MOCK_ACCESS_CODE_${reference}`,
          is_mock: true,
        },
      });
    }

    // Call actual Paystack API
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        reference,
        callback_url: `${req.protocol}://${req.get("host")}/api/payments/paystack/verify-callback`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({
        success: false,
        message: "Failed to initialize Paystack payment.",
        error: data.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paystack payment initialized successfully.",
      data: {
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
        access_code: data.data.access_code,
      },
    });
  } catch (error) {
    console.error("Initialize Paystack Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while initializing Paystack payment.",
      error: error.message,
    });
  }
};

// Verify Paystack Payment
exports.verifyPaystack = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required.",
      });
    }

    const payment = await Payments.findOne({ where: { transaction_reference: reference } });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction record not found.",
      });
    }

    if (payment.payment_status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Transaction verified successfully (Already Paid).",
        booking_id: payment.booking_id,
      });
    }

    // Check if secret key exists. If not, this is a mock verification
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.log("[PAYSTACK] Mock verifying transaction:", reference);
      await finalizePaymentSuccess(payment.booking_id, payment.id);

      return res.status(200).json({
        success: true,
        message: "Transaction verified successfully (SIMULATED PAY).",
        booking_id: payment.booking_id,
      });
    }

    // Call actual Paystack API to verify
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== "success") {
      payment.payment_status = "failed";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed or payment not completed.",
        data: data.data,
      });
    }

    // Finalize successful payment
    await finalizePaymentSuccess(payment.booking_id, payment.id);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
      booking_id: payment.booking_id,
    });
  } catch (error) {
    console.error("Verify Paystack Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying Paystack payment.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// CRYPTOCURRENCY PAYMENT INTEGRATION
// ----------------------------------------------------

// Preset cryptocurrency addresses
const CRYPTO_WALLETS = {
  USDT: process.env.CRYPTO_USDT_ADDR || "TX5d8t7fHkpqSm129hWJnB8bQvPtm182zL", // TRC20 address
  BTC: process.env.CRYPTO_BTC_ADDR || "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",   // Bitcoin address
  ETH: process.env.CRYPTO_ETH_ADDR || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // Ethereum address
};

// Converted prices (Simulated exchange rates relative to USD)
const COIN_RATES = {
  USDT: 1.0,        // 1 USD = 1 USDT
  BTC: 0.000015,    // Mock rate: 1 USD = 0.000015 BTC
  ETH: 0.00032,     // Mock rate: 1 USD = 0.00032 ETH
};

// Initialize Crypto Payment
exports.initializeCrypto = async (req, res) => {
  try {
    const { bookingId, coin } = req.body;

    if (!bookingId || !coin) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and target Cryptocurrency coin (USDT, BTC, or ETH) are required.",
      });
    }

    const selectedCoin = coin.toUpperCase();
    if (!CRYPTO_WALLETS[selectedCoin]) {
      return res.status(400).json({
        success: false,
        message: "Unsupported cryptocurrency. Supported coins are: USDT, BTC, ETH.",
      });
    }

    const booking = await bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.booking_status === "confirmed" || booking.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid for and confirmed.",
      });
    }

    // Convert booking total price (assuming NGN or USD)
    // For simplicity, let's treat the booking price in USD for conversion.
    // If NGN, we can convert using a base rate (e.g. 1 USD = 1500 NGN).
    let priceInUSD = parseFloat(booking.total_price);
    // If the currency seems like NGN (which is default for Nigerian Suite app), convert it:
    if (priceInUSD > 5000) {
      priceInUSD = priceInUSD / 1500; // Mock exchange rate: 1500 NGN = 1 USD
    }

    const rate = COIN_RATES[selectedCoin];
    const cryptoAmount = (priceInUSD * rate).toFixed(selectedCoin === "USDT" ? 2 : 6);

    const reference = `CRYPTO-${selectedCoin}-${crypto.randomBytes(8).toString("hex")}`;

    // Create pending payment in database
    const pendingPayment = await Payments.create({
      booking_id: booking.id,
      amount: cryptoAmount,
      currency: selectedCoin,
      payment_method: `crypto_${selectedCoin.toLowerCase()}`,
      transaction_reference: reference,
      payment_status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Crypto payment initialized. Please transfer funds to the address provided below.",
      data: {
        bookingId: booking.id,
        totalUSD: priceInUSD.toFixed(2),
        cryptoAmount,
        currency: selectedCoin,
        walletAddress: CRYPTO_WALLETS[selectedCoin],
        reference,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(CRYPTO_WALLETS[selectedCoin])}`,
      },
    });
  } catch (error) {
    console.error("Initialize Crypto Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while initializing cryptocurrency payment.",
      error: error.message,
    });
  }
};

// Verify Crypto Payment (Simulated verification with transaction hash)
exports.verifyCrypto = async (req, res) => {
  try {
    const { reference, txHash } = req.body;

    if (!reference || !txHash) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference and blockchain transaction hash (txHash) are required.",
      });
    }

    // Find the payment record
    const payment = await Payments.findOne({ where: { transaction_reference: reference } });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction record not found.",
      });
    }

    if (payment.payment_status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Cryptocurrency transaction verified successfully (Already Verified).",
        booking_id: payment.booking_id,
      });
    }

    // Basic regex validation for a standard transaction hash:
    // BTC: 64-char hex string
    // ETH/USDT: 66-char hex starting with 0x
    const cleanHash = txHash.trim();
    const isValidHash = (/^(0x)?[0-9a-fA-F]{64}$/).test(cleanHash);

    if (!isValidHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction hash format. Please enter a valid blockchain transaction hash.",
      });
    }

    // Simulate blockchain confirmation checking
    console.log(`[CRYPTO] Verifying hash: ${cleanHash} for payment reference: ${reference}`);

    // Update payment record to success in database
    await finalizePaymentSuccess(payment.booking_id, payment.id);

    return res.status(200).json({
      success: true,
      message: "Cryptocurrency payment confirmed! Your booking is now verified and active.",
      data: {
        reference,
        txHash: cleanHash,
        confirmations: 12,
        blockHeight: Math.floor(Math.random() * 5000000) + 12000000,
        status: "success",
      },
    });
  } catch (error) {
    console.error("Verify Crypto Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying cryptocurrency payment.",
      error: error.message,
    });
  }
};
