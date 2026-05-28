const rateLimit = require("express-rate-limit");

// 1. Sensitive Authentication Rate Limiter (Registration, Login, OTP, Recovery)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20, // Limit each IP to 20 requests per window
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. General API Rate Limiter
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 200, // Limit each IP to 200 requests per window
  message: {
    success: false,
    message: "Too many requests to the server. Please slow down and try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authRateLimiter,
  generalRateLimiter
};
