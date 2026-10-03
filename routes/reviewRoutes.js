const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalUser } = require('../middleware/authMiddleware');

router.get('/', reviewController.getAllReviews);
router.post('/', optionalUser, reviewController.addReview);

module.exports = router;
