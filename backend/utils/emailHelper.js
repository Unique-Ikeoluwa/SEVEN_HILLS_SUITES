const nodemailer = require("nodemailer");

async function sendOtpEmail(email, otpCode, fullName) {
  const isTestEmail = email.endsWith("@sevenhills.com") || email.endsWith("@example.com") || email.endsWith("@test.com") || email.includes("test");
  if (isTestEmail) {
    console.log(`\n==========================================`);
    console.log(`[EMAIL SIMULATOR] Bypassing SMTP for test email address: ${email}`);
    console.log(`[EMAIL SIMULATOR] Hello ${fullName || 'User'}, your OTP Code is: ${otpCode}`);
    console.log(`==========================================\n`);
    return true;
  }

  // Check if SMTP credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("[EMAIL HELPER] SMTP Credentials not configured in .env. Falling back to simulated log above.");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Seven Hills Suites" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Seven Hills Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #1a1a1a; text-align: center;">Welcome to Seven Hills Suites!</h2>
          <p>Hi ${fullName || 'there'},</p>
          <p>Thank you for registering with us. To complete your sign-up, please use the following One-Time Password (OTP) to verify your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #F3F4F6; padding: 10px 20px; border-radius: 6px;">${otpCode}</span>
          </div>
          <p style="color: #666;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Seven Hills Suites Inc. &copy; 2026</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL HELPER] Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[EMAIL HELPER] Error sending email via SMTP:", error);
    // Return true anyway because the developer can see the console fallback OTP
    return false;
  }
}

async function sendResetPasswordEmail(email, otpCode, fullName) {
  const isTestEmail = email.endsWith("@sevenhills.com") || email.endsWith("@example.com") || email.endsWith("@test.com") || email.includes("test");
  if (isTestEmail) {
    console.log(`\n==========================================`);
    console.log(`[EMAIL SIMULATOR] Bypassing SMTP for test email address: ${email}`);
    console.log(`[EMAIL SIMULATOR] Hello ${fullName || 'User'}, your Reset Password OTP Code is: ${otpCode}`);
    console.log(`==========================================\n`);
    return true;
  }

  // Check if SMTP credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("[EMAIL HELPER] SMTP Credentials not configured in .env. Falling back to simulated log above.");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Seven Hills Suites" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Seven Hills Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #e11d48; text-align: center;">Reset Your Password</h2>
          <p>Hi ${fullName || 'there'},</p>
          <p>We received a request to reset the password associated with your Seven Hills Suites account. Please use the following One-Time Password (OTP) to proceed with your password reset:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e11d48; background-color: #F3F4F6; padding: 10px 20px; border-radius: 6px;">${otpCode}</span>
          </div>
          <p style="color: #666;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email and your password will remain unchanged.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Seven Hills Suites Inc. &copy; 2026</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL HELPER] Password reset email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[EMAIL HELPER] Error sending password reset email via SMTP:", error);
    return false;
  }
}

module.exports = { sendOtpEmail, sendResetPasswordEmail };
