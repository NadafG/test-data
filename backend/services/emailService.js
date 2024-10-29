// emailService.js

const { Resend } = require('resend');

// Initialize Resend instance with your API key
const resend = new Resend('re_WeSHN95p_2qKakTEFjhhoLMAPNuT9aKkB');

/**
 * Send an email using Resend API.
 * @param {string} from - The email address of the sender.
 * @param {string} to - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise} - A promise that resolves with the result of the email send operation.
 */
async function sendEmail(from, to, subject, html) {
  try {
    const result = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: html,
    });
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
