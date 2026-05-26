const nodemailer = require("nodemailer");
const db = require("../models");
const { Notification, Users } = db;

// Configure Nodemailer Transporter
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST || "smtp.ethereal.email";
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
  const secure = port === 465;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      // Deliverability tuning:
      tls: {
        rejectUnauthorized: false
      },
      family: 4 // Force IPv4 to prevent connection timeouts
    });
  }

  // Fallback Ethereal testing credentials
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "ethereal.user@ethereal.email", // Placeholder fallback
      pass: "etherealPassword"
    },
    family: 4
  });
};

/**
 * Render a beautiful, premium, spam-resistant HTML email template
 */
const renderEmailHtml = (fullName, title, messageBody) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          background-color: #f8fafc;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #1e1b4b, #0f172a);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: #f59e0b;
          font-size: 28px;
          margin: 0;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .header p {
          color: #94a3b8;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
        }
        .message-body {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 30px;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #64748b;
        }
        .footer a {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>SEVEN HILLS SUITES</h1>
            <p>Exclusive Luxury Accommodations</p>
          </div>
          <div class="content">
            <div class="greeting">Hello ${fullName || "Valued Guest"},</div>
            <div class="message-body">
              ${messageBody}
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Seven Hills Suites. All rights reserved.</p>
            <p>If you have any questions, contact us at <a href="mailto:support@sevenhills.com">support@sevenhills.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Sends a highly spam-resistant email using nodemailer
 */
const sendSpamFreeEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = getTransporter();
    
    // Generate clean message ID to avoid spam filters
    const domain = process.env.EMAIL_USER ? process.env.EMAIL_USER.split("@")[1] : "sevenhills.com";
    const uniqueMessageId = `<${Date.now()}-${Math.random().toString(36).substring(2, 15)}@${domain}>`;

    const mailOptions = {
      from: `"Seven Hills Suites" <${process.env.EMAIL_USER || "no-reply@sevenhills.com"}>`,
      to,
      subject,
      text,
      html,
      // Spam protection headers:
      headers: {
        "Message-ID": uniqueMessageId,
        "Precedence": "bulk",
        "X-Auto-Response-Loop": "on",
        "List-Unsubscribe": `<mailto:unsubscribe@sevenhills.com?subject=unsubscribe>`
      },
      priority: "high"
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Alert successfully dispatched: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[EMAIL ERROR] Delivery failed:", error);
    return false;
  }
};

/**
 * Core Helper to Send Unified App & Email Notifications to both Users and Admins
 */
exports.sendNotification = async ({ userId, message, emailSubject, emailBodyText, customEmail }) => {
  try {
    let email = customEmail;
    let fullName = "User";

    // 1. Fetch User details from DB if userId is specified
    if (userId) {
      const user = await Users.findByPk(userId);
      if (user) {
        if (!email) email = user.email;
        fullName = user.fullName;
      }
    }

    // 2. Save Notification to Database (App Notification)
    let savedNotification = null;
    if (userId) {
      savedNotification = await Notification.create({
        user_id: userId,
        message,
        is_read: "false"
      });

      // 3. Emit via Socket.io for Real-time App Notification updates
      if (global.io) {
        global.io.to(`room_${userId}`).emit("new_app_notification", {
          id: savedNotification.id,
          message,
          is_read: "false",
          createdAt: savedNotification.createdAt
        });
      }
    }

    // 4. Send Deliverable Email Notification
    if (email) {
      const formattedHtml = renderEmailHtml(fullName, emailSubject || "Seven Hills Suites Update", emailBodyText);
      await sendSpamFreeEmail({
        to: email,
        subject: emailSubject || "Seven Hills Suites Update",
        html: formattedHtml,
        text: `${fullName},\n\n${message}\n\nBest regards,\nSeven Hills Suites Team`
      });
    }

    return true;
  } catch (error) {
    console.error("[NOTIFICATION HELPER ERROR]:", error);
    return false;
  }
};

/**
 * Broadcaster Helper to send notifications to all Admin Users
 */
exports.notifyAdmins = async ({ message, emailSubject, emailBodyText }) => {
  try {
    // Fetch all admins/support staff
    const admins = await Users.findAll({
      where: {
        role: ["admin", "support"]
      }
    });

    for (const admin of admins) {
      await exports.sendNotification({
        userId: admin.id,
        message,
        emailSubject,
        emailBodyText
      });
    }

    return true;
  } catch (error) {
    console.error("[ADMIN NOTIFICATION ERROR]:", error);
    return false;
  }
};
