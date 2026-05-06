const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/emailService");
const path = require("path");

/**
 * @route   POST /api/email/send
 * @desc    Send a custom email
 * @access  Private (should be protected by auth middleware)
 */
router.post("/send", async (req, res) => {
  let { to, subject, html, text, attachments } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide to, subject, and html content" 
    });
  }

  // Resolve absolute paths for attachments if they are relative to public dir
  if (attachments && Array.isArray(attachments)) {
    attachments = attachments.map(attr => {
      if (attr.path && attr.path.startsWith("/")) {
        // Assuming /offer-letters/... or /joining-letters/...
        // The files are in the 'public' folder
        return {
          ...attr,
          path: path.join(__dirname, "../public", attr.path)
        };
      }
      return attr;
    });
  }

  const result = await sendEmail({ to, subject, html, text, attachments });

  if (result.success) {
    res.status(200).json({ 
      success: true, 
      message: "Email sent successfully",
      messageId: result.messageId
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email",
      error: result.error
    });
  }
});

module.exports = router;
