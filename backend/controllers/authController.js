const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Users } = db;
const { sendOtpEmail, sendResetPasswordEmail } = require("../utils/emailHelper");


exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone_no } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are required.",
      });
    }


    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({ message: "Password must contain both uppercase and lowercase letters" });
    } else if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: "Password must contain a number" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    } else if (fullName.length < 3 ) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    } else if (phone_no.length < 9) {
      return res.status(400).json({ message: "Phone number must be at least 9 digit" });
}
    
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    const role = "user";

   
    const newUser = await Users.create({
      fullName,
      email,
      password: hashedPassword,
      phone_no: phone_no || "",
      role: role || "user",
      otpCode,
      otpExpiresAt,
      is_active: false,
    });

    sendOtpEmail(email, otpCode, fullName);

    return res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for the verification code.",
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        is_active: newUser.is_active,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required.",
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified.",
      });
    }


    if (user.otpCode !== parseInt(otpCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code.",
      });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP code has expired. Please request a new registration.",
      });
    }

    // Update user status
    user.is_verified = true;
    user.is_active = false; // Remains false until successful login
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    // Send Welcoming Notifications
    const { sendNotification, notifyAdmins } = require("../utils/notificationHelper");
    await sendNotification({
      userId: user.id,
      message: "Welcome to Seven Hills Suites! Your account has been verified successfully. You can now log in.",
      emailSubject: "Welcome to Seven Hills Suites 🎉",
      emailBodyText: `<p>Your email has been verified successfully.</p><p>Welcome to Seven Hills Suites, where luxury meets class. Log in now to reserve your exclusive suite.</p>`
    });

    // Notify admins
    await notifyAdmins({
      message: `New user registration: ${user.fullName} (${user.email}) has signed up and verified their email.`,
      emailSubject: "New User Registered 🔑",
      emailBodyText: `<p>A new user has completed email verification.</p><p><b>Name:</b> ${user.fullName}<br/><b>Email:</b> ${user.email}</p>`
    });

    return res.status(200).json({
      success: true,
      message: "Account verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during verification. Please try again.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if account is verified
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Set user as active on successful login
    user.is_active = true;
    await user.save();

    // Send Login alert notification
    const { sendNotification } = require("../utils/notificationHelper");
    await sendNotification({
      userId: user.id,
      message: `You successfully logged in at ${new Date().toLocaleString()}.`,
      emailSubject: "Successful Login Notification 🔐",
      emailBodyText: `<p>This is to notify you that a successful login was recorded for your Seven Hills Suites account at <b>${new Date().toLocaleString()}</b>.</p>`
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone_no: user.phone_no,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again.",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId, {
      attributes: { exclude: ["password", "otpCode", "otpExpiresAt"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching your profile.",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone_no } = req.body;

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    if (fullName) user.fullName = fullName;
    if (phone_no !== undefined) user.phone_no = phone_no;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone_no: user.phone_no,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating your profile.",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);

    if (user) {
      user.is_active = false;
      await user.save();

      // Send Logout notification
      const { sendNotification } = require("../utils/notificationHelper");
      await sendNotification({
        userId: user.id,
        message: "You have successfully logged out of your account.",
        emailSubject: "Successful Logout 🔐",
        emailBodyText: `<p>You have logged out of your Seven Hills Suites account at ${new Date().toLocaleString()}.</p>`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout.",
      error: error.message,
    });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone_no } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Custom validations
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({ message: "Password must contain both uppercase and lowercase letters" });
    } else if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: "Password must contain a number" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin User (directly verified)
    const newAdmin = await Users.create({
      fullName,
      email,
      password: hashedPassword,
      phone_no: phone_no || "",
      role: "admin",
      is_active: false,
      is_verified: true, // directly verified
    });

    // Send Welcome Email and App Notification
    const { sendNotification } = require("../utils/notificationHelper");
    await sendNotification({
      userId: newAdmin.id,
      message: `Welcome to the Seven Hills Suites Admin Panel. Your administrator profile has been created successfully.`,
      emailSubject: "Welcome to Seven Hills Suites Admin Panel 🔑",
      emailBodyText: `<h3>Welcome to the Team, ${fullName}!</h3><p>Your administrator profile has been created and verified successfully. You can now use your credentials to log in to the management system.</p>`
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
      data: {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role,
        is_verified: newAdmin.is_verified,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during admin registration.",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "A user with this email address does not exist.",
      });
    }

    // Generate secure 6-digit OTP code for password reset
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validation

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send the password recovery email helper
    await sendResetPasswordEmail(email, otpCode, user.fullName);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully! Please check your email inbox.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while initiating password reset request.",
      error: error.message,
    });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required.",
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.otpCode !== parseInt(otpCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset OTP code.",
      });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Password reset OTP code has expired. Please request a new one.",
      });
    }

    // Clear OTP details upon successful verification to make it single-use
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    // Issue a secure, short-lived password reset token
    const resetToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        purpose: "password_reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully! You may now proceed to update your password.",
      resetToken: resetToken,
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the OTP.",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    // Validate password complexity
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    } else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain both uppercase and lowercase letters" });
    } else if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain a number" });
    }

    // Verify token validity
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired password reset token. Please restart the forgot password process.",
      });
    }

    if (decoded.purpose !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid token payload purpose.",
      });
    }

    const user = await Users.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User associated with this token not found.",
      });
    }

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Trigger success notification
    const { sendNotification } = require("../utils/notificationHelper");
    await sendNotification({
      userId: user.id,
      message: "Your Seven Hills account password has been reset successfully.",
      emailSubject: "Password Reset Confirmation 🔒",
      emailBodyText: `<h3>Security Confirmation</h3><p>Hi ${user.fullName},</p><p>This is to confirm that the password for your Seven Hills Suites account was successfully reset. If you did not make this change, please contact customer support immediately.</p>`
    });

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully! You can now log in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password. Please try again.",
      error: error.message,
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email, reason } = req.body; // reason can be 'registration' or 'forgot_password'

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const flowReason = reason || "registration";

    if (flowReason === "registration") {
      if (user.is_verified) {
        return res.status(400).json({
          success: false,
          message: "Account is already verified. Please log in directly.",
        });
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();

      await sendOtpEmail(email, otpCode, user.fullName);
    } else if (flowReason === "forgot_password") {
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();

      await sendResetPasswordEmail(email, otpCode, user.fullName);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid resend OTP reason. Supported options: 'registration', 'forgot_password'.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `A fresh OTP code for ${flowReason.replace('_', ' ')} has been sent to your email inbox.`,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resending verification OTP.",
      error: error.message,
    });
  }
};

