const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authMiddleware } = require("../middlewares/authUserMiddleware");

// Protected payment initializations
router.post("/paystack/initialize", authMiddleware, paymentController.initializePaystack);
router.post("/crypto/initialize", authMiddleware, paymentController.initializeCrypto);
router.post("/crypto/verify", authMiddleware, paymentController.verifyCrypto);

// Verification routes
router.get("/paystack/verify", paymentController.verifyPaystack);
router.get("/paystack/verify-callback", paymentController.verifyCallback);

// Mock checkout page for developer testing when Paystack API keys aren't configured
router.get("/paystack/mock-checkout", (req, res) => {
  const { reference, bookingId, redirect_url } = req.query;

  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seven Hills - Paystack Mock Checkout</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f172a, #1e1b4b);
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          max-width: 450px;
          width: 100%;
        }
        h2 {
          color: #38bdf8;
          font-size: 28px;
          margin-bottom: 8px;
        }
        p {
          color: #94a3b8;
          font-size: 16px;
          margin-bottom: 24px;
        }
        .info-box {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 32px;
          text-align: left;
          font-size: 14px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .info-label {
          color: #64748b;
        }
        .info-value {
          font-weight: 600;
          color: #cbd5e1;
        }
        .btn {
          display: block;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }
        .btn-success {
          background: #0284c7;
          color: white;
        }
        .btn-success:hover {
          background: #0369a1;
          box-shadow: 0 0 15px rgba(2, 132, 199, 0.4);
        }
        .btn-danger {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Paystack Mock Checkout</h2>
        <p>Seven Hills Suites Payment Gateway</p>
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Booking ID:</span>
            <span class="info-value">${bookingId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Reference:</span>
            <span class="info-value" style="font-family: monospace;">${reference}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Amount:</span>
            <span class="info-value" style="color: #4ade80;">Calculated on verify</span>
          </div>
        </div>
        <button class="btn btn-success" onclick="verifyPayment('success')">Simulate Successful Payment</button>
        <button class="btn btn-danger" onclick="verifyPayment('failed')">Simulate Failed Payment</button>
      </div>

      <script>
        function verifyPayment(status) {
          const redirectUrl = ${redirect_url ? `'${redirect_url}'` : 'null'};
          if (status === 'success') {
            if (redirectUrl) {
              window.location.href = '/api/payments/paystack/verify-callback?reference=${reference}&redirect_url=' + encodeURIComponent(redirectUrl);
            } else {
              window.location.href = '/api/payments/paystack/verify-callback?reference=${reference}';
            }
          } else {
            if (redirectUrl) {
              window.location.href = '/api/payments/paystack/verify-callback?reference=${reference}&status=failed&redirect_url=' + encodeURIComponent(redirectUrl);
            } else {
              window.location.href = '/api/payments/paystack/verify-callback?reference=${reference}&status=failed';
            }
          }
        }
      </script>
    </body>
    </html>
  `);
});

module.exports = router;
