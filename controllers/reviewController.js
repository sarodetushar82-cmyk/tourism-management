/**
 * Review Controller
 * Handles customer testimonials and rating submissions
 */

const db = require('../config/db');

/**
 * Get all reviews
 */
async function getAllReviews(req, res) {
  try {
    const reviews = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
    return res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
}

/**
 * Add a review
 */
async function addReview(req, res) {
  try {
    const { destination_name, rating, comment } = req.body;
    const userName = req.user ? req.user.name : (req.body.user_name || 'Travel Enthusiast');
    const avatar = req.body.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and review comment are required.' });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    const result = await db.query(
      `INSERT INTO reviews (user_name, user_avatar, destination_name, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [userName, avatar, destination_name || 'India Explorer', numRating, comment.trim()]
    );

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully! Thank you for sharing your experience.',
      reviewId: result.insertId
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ success: false, message: 'Failed to post review.' });
  }
}

module.exports = {
  getAllReviews,
  addReview
};
