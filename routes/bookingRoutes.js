const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, verifyAdmin, optionalUser } = require('../middleware/authMiddleware');

// User routes
router.post('/', optionalUser, bookingController.createBooking);
router.get('/my-bookings', verifyToken, bookingController.getMyBookings);
router.put('/:id/cancel', verifyToken, bookingController.cancelBooking);

// Admin routes
router.get('/admin/all', verifyAdmin, bookingController.getAllBookings);
router.put('/admin/:id/status', verifyAdmin, bookingController.updateBookingStatus);

module.exports = router;
