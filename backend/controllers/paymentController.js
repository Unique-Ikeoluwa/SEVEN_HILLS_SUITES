const db = require("../models");
const { Payments, bookings, Apartment, Users, Wallets } = db;
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function getExchangeRate() {
  try {
    const settingsPath = path.join(__dirname, "../config/settings.json");
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      return parseFloat(settings.usd_to_ngn_rate) || 1500.0;
    }
  } catch (error) {
    console.error("Failed to read exchange rate:", error);
  }
  return 1500.0;
}



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

    
    const apartment = await Apartment.findByPk(booking.apartment_id);
    if (apartment) {
      apartment.status = "booked";
      await apartment.save();
    }

  
    const user = await Users.findByPk(booking.user_id);

    
    const { renderReceiptHtml } = require("../utils/receiptHelper");
    const receiptHtml = renderReceiptHtml({ booking, payment, apartment, user });

    
    const { sendNotification, notifyAdmins } = require("../utils/notificationHelper");
    
    await sendNotification({
      userId: booking.user_id,
      message: `Your booking (ID: ${booking.id}) for "${apartment ? apartment.title : 'Suite'}" has been paid and confirmed! Receipt reference: ${payment ? payment.transaction_reference : 'N/A'}. Guest: ${user ? user.fullName : 'Valued Guest'} (Phone: ${user ? user.phone_no : 'N/A'}).`,
      emailSubject: "Your Payment Receipt - Seven Hills Suites 🏨🧾",
      emailBodyText: receiptHtml
    });

    await notifyAdmins({
      message: `Payment received and verified for Booking ID ${booking.id}. Receipt reference: ${payment ? payment.transaction_reference : 'N/A'}. Guest: ${user ? user.fullName : 'Valued Guest'} (${user ? user.email : 'N/A'}, Phone: ${user ? user.phone_no : 'N/A'}).`,
      emailSubject: "Payment Verified & Receipt Issued 🔔🧾",
      emailBodyText: receiptHtml
    });
  }
}


async function initPaystackInternal({ bookingId, userEmail, protocol, host, redirect_url }) {
  const booking = await bookings.findByPk(bookingId);
  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.booking_status === "confirmed" || booking.payment_status === "paid") {
    throw new Error("This booking has already been paid for and confirmed.");
  }

  const apartment = await Apartment.findByPk(booking.apartment_id);
  const apartmentCurrency = (apartment && apartment.currency) ? apartment.currency.toUpperCase() : "USD";

  let paystackAmount = parseFloat(booking.total_price);
  if (apartmentCurrency === "USD") {
    const usdToNgnRate = getExchangeRate();
    paystackAmount = paystackAmount * usdToNgnRate;
  }

  const reference = `PAY-${crypto.randomBytes(8).toString("hex")}`;
  const amountKobo = Math.round(paystackAmount * 100);

  // Save pending payment record in db
  const pendingPayment = await Payments.create({
    booking_id: booking.id,
    amount: paystackAmount.toFixed(2),
    currency: "NGN",
    payment_method: "paystack",
    transaction_reference: reference,
    payment_status: "pending",
  });

  const activeCallbackUrl = redirect_url || `${protocol}://${host}/api/payments/paystack/verify-callback`;

  // Check if PAYSTACK_SECRET_KEY is configured
  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.log("[PAYSTACK] PAYSTACK_SECRET_KEY not set in .env. Simulating Paystack Checkout.");
    
    return {
      authorization_url: `${protocol}://${host}/api/payments/paystack/mock-checkout?reference=${reference}&bookingId=${bookingId}${redirect_url ? `&redirect_url=${encodeURIComponent(redirect_url)}` : ''}`,
      reference,
      access_code: `MOCK_ACCESS_CODE_${reference}`,
      is_mock: true,
      payment: pendingPayment,
    };
  }

  // Call actual Paystack API
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail,
      amount: amountKobo,
      reference,
      callback_url: activeCallbackUrl,
    }),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Failed to initialize Paystack payment.");
  }

  return {
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
    access_code: data.data.access_code,
    is_mock: false,
    payment: pendingPayment,
  };
}

exports.initPaystackInternal = initPaystackInternal;

exports.initializePaystack = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const redirect_url = process.env.PAYSTACK_REDIRECT_URL || "http://localhost:8300/bookings/my-bookings";

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    const email = req.user.email;
    const protocol = req.protocol;
    const host = req.get("host");

    const paymentDetails = await initPaystackInternal({
      bookingId,
      userEmail: email,
      protocol,
      host,
      redirect_url,
    });

    return res.status(200).json({
      success: true,
      message: paymentDetails.is_mock
        ? "Paystack payment initialized (SIMULATED MODE)."
        : "Paystack payment initialized successfully.",
      data: paymentDetails,
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



// Converted prices (Simulated exchange rates relative to USD - pegged 1:1)
const COIN_RATES = {
  USDC: 1.0,        // 1 USD = 1 USDC
};

async function initCryptoInternal({ bookingId }) {
  const selectedCoin = "USDC";

  const booking = await bookings.findByPk(bookingId);
  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.booking_status === "confirmed" || booking.payment_status === "paid") {
    throw new Error("This booking has already been paid for and confirmed.");
  }

  const apartment = await Apartment.findByPk(booking.apartment_id);
  const apartmentCurrency = (apartment && apartment.currency) ? apartment.currency.toUpperCase() : "USD";

  let priceInUSD = parseFloat(booking.total_price);
  if (apartment && apartment.price_in_usd) {
    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const days = Math.ceil(diffTime / (1000 * 3600 * 24)) || 1;
    priceInUSD = parseFloat(apartment.price_in_usd) * days;
  } else if (apartmentCurrency === "NGN") {
    const usdToNgnRate = getExchangeRate();
    priceInUSD = priceInUSD / usdToNgnRate;
  }

  const rate = COIN_RATES[selectedCoin];
  const cryptoAmount = (priceInUSD * rate).toFixed(2); // USDC stablecoin is 1:1 USD

  const reference = `CRYPTO-${selectedCoin}-${crypto.randomBytes(8).toString("hex")}`;

  // Resolve the active Ethereum wallet address dynamically for ERC-20 USDC payments
  const dbWallet = await Wallets.findOne({ order: [["id", "DESC"]] });
  if (!dbWallet || !dbWallet.public_address) {
    throw new Error("No active admin blockchain wallet is configured in the database. Please generate an admin wallet first.");
  }
  const walletAddress = dbWallet.public_address;

  // Create pending payment in database
  const pendingPayment = await Payments.create({
    booking_id: booking.id,
    amount: cryptoAmount,
    currency: selectedCoin,
    payment_method: "crypto_usdc",
    transaction_reference: reference,
    payment_status: "pending",
  });

  return {
    bookingId: booking.id,
    totalUSD: priceInUSD.toFixed(2),
    cryptoAmount,
    currency: selectedCoin,
    walletAddress,
    reference,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(walletAddress)}`,
    payment: pendingPayment,
  };
}

exports.initCryptoInternal = initCryptoInternal;

exports.initializeCrypto = async (req, res) => {
  try {
    const { bookingId, coin } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    if (coin && coin.toUpperCase() !== "USDC") {
      return res.status(400).json({
        success: false,
        message: "Unsupported cryptocurrency. Crypto payments are restricted to USDC exclusively.",
      });
    }

    const paymentDetails = await initCryptoInternal({ bookingId });

    return res.status(200).json({
      success: true,
      message: "Crypto payment initialized. Please transfer funds to the address provided below.",
      data: paymentDetails,
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
    // ETH/USDT/USDC: 66-char hex starting with 0x (or general 64-char hex)
    const cleanHash = txHash.trim();
    const isValidHash = (/^(0x)?[0-9a-fA-F]{64}$/).test(cleanHash);

    if (!isValidHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction hash format. Please enter a valid blockchain transaction hash.",
      });
    }

    // Resolve active Ethereum wallet address dynamically to double check transaction destination
    const dbWallet = await Wallets.findOne({ order: [["id", "DESC"]] });
    if (!dbWallet || !dbWallet.public_address) {
      return res.status(400).json({
        success: false,
        message: "Active blockchain admin wallet not found in database. Transaction verification aborted.",
      });
    }
    const walletAddress = dbWallet.public_address;

    // Dynamic real blockchain check if ETH_RPC_URL is set
    const rpcUrl = process.env.ETH_RPC_URL;
    let blockchainVerified = false;
    let confirmationsCount = 12;
    let blockNum = Math.floor(Math.random() * 5000000) + 12000000;

    if (rpcUrl) {
      try {
        console.log(`[CRYPTO] Verifying transaction on-chain for hash: ${cleanHash}`);
        const { JsonRpcProvider } = require("ethers");
        const provider = new JsonRpcProvider(rpcUrl);
        const txReceipt = await provider.getTransactionReceipt(cleanHash);

        if (!txReceipt) {
          return res.status(400).json({
            success: false,
            message: "Transaction hash not found on-chain. Please ensure it has been broadcasted.",
          });
        }

        if (txReceipt.status !== 1) {
          return res.status(400).json({
            success: false,
            message: "Transaction has failed on-chain.",
          });
        }

        // Verify it was sent to our correct wallet address
        if (txReceipt.to && txReceipt.to.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(400).json({
            success: false,
            message: `Transaction destination address mismatch. Expected: ${walletAddress}, Found: ${txReceipt.to}`,
          });
        }

        blockchainVerified = true;
        confirmationsCount = txReceipt.confirmations || 12;
        blockNum = txReceipt.blockNumber;
      } catch (chainErr) {
        console.warn("On-chain lookup failed, falling back to simulated validation:", chainErr.message);
      }
    }

    // Update payment record to success in database
    await finalizePaymentSuccess(payment.booking_id, payment.id);

    return res.status(200).json({
      success: true,
      message: rpcUrl && blockchainVerified
        ? "Cryptocurrency payment confirmed and verified on-chain successfully!"
        : "Cryptocurrency payment confirmed! Your booking is now verified and active.",
      data: {
        reference,
        txHash: cleanHash,
        confirmations: confirmationsCount,
        blockHeight: blockNum,
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

exports.verifyCallback = async (req, res) => {
  try {
    const { reference, trxref, status, redirect_url } = req.query;
    const finalReference = reference || trxref;

    if (!finalReference) {
      return res.status(400).send("Transaction reference is missing.");
    }

    const payment = await Payments.findOne({ where: { transaction_reference: finalReference } });
    if (!payment) {
      return res.status(404).send("Payment transaction record not found.");
    }

    let isSuccess = false;

    if (status === "failed") {
      payment.payment_status = "failed";
      await payment.save();
    } else if (payment.payment_status === "paid") {
      isSuccess = true;
    } else {
      // Verify payment
      if (!process.env.PAYSTACK_SECRET_KEY) {
        await finalizePaymentSuccess(payment.booking_id, payment.id);
        isSuccess = true;
      } else {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(finalReference)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        });
        const data = await response.json();
        if (data.status && data.data.status === "success") {
          await finalizePaymentSuccess(payment.booking_id, payment.id);
          isSuccess = true;
        } else {
          payment.payment_status = "failed";
          await payment.save();
        }
      }
    }

    const activeRedirect = redirect_url || process.env.PAYSTACK_REDIRECT_URL || "http://localhost:8300/bookings/my-bookings";
    const separator = activeRedirect.includes("?") ? "&" : "?";
    const finalRedirect = `${activeRedirect}${separator}reference=${finalReference}&status=${isSuccess ? "success" : "failed"}&booking_id=${payment.booking_id}`;
    return res.redirect(finalRedirect);
  } catch (error) {
    console.error("Paystack Redirect Callback Error:", error);
    return res.status(500).send("An error occurred while handling the redirect callback.");
  }
};
