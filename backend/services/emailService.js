const nodemailer = require('nodemailer');

// Configure the transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zoompointindia@gmail.com',   // Your Gmail address
    pass: 'qhpa kxyv ucpk gmdq',    // Your Gmail password (or App Password if 2FA enabled)
  },
});

/**
 * Send an email using Nodemailer.
 * @param {string} from - The sender email address.
 * @param {string} to - The recipient email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML body content of the email.
 * @returns {Promise} - A promise that resolves with the email sending result.
 */
async function sendEmail(from, to, subject, html) {

  const mailOptions = {
    from: '"ZoomPoint India" <zoompointindia@gmail.com>',  // Properly formatted sender info
    to: to,
    subject: subject,
    html: html,
    text: 'This is the plain text version of the email.',  // Provide a plain text alternative
    headers: {
      'X-Priority': '3', // Normal priority (1 = high, 5 = low)
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
