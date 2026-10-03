/**
 * Contact Controller
 * Handles visitor inquiry submissions and admin message management
 */

const db = require('../config/db');

/**
 * Submit contact message
 */
async function submitMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const result = await db.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : '',
        subject ? subject.trim() : 'General Inquiry',
        message.trim(),
        'Unread'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our travel advisory team will contact you shortly.',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
}

/**
 * Admin: Get all messages
 */
async function getAllMessages(req, res) {
  try {
    const rows = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
}

/**
 * Admin: Delete message
 */
async function deleteMessage(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Message deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
}

/**
 * Admin: Update message status
 */
async function updateMessageStatus(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    await db.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    return res.json({
      success: true,
      message: 'Message status updated.'
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update message status.' });
  }
}

module.exports = {
  submitMessage,
  getAllMessages,
  deleteMessage,
  updateMessageStatus
};
