const nodemailer = require("nodemailer");

/**
 * Reusable Email Service using Nodemailer
 */
const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    // Check if email config is present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Email configuration missing in .env");
      return { success: false, error: "Email configuration missing" };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"VP Finance HR" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "", // plain text body
      html: html, // html body
      attachments: attachments || [], // array of { filename, path }
    });

    console.log("✅ Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
