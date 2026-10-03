/**
 * Booking Controller
 * Manages bookings, calculations, cancellation, and admin status updates
 */

const db = require('../config/db');

/**
 * Generate human-friendly booking reference (e.g. TRV-2026-8492)
 */
function generateBookingRef() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TRV-${year}-${random}`;
}

/**
 * Create a new booking
 */
async function createBooking(req, res) {
  try {
    const {
      package_id,
      destination_id,
      user_name,
      email,
      phone,
      destination_name,
      package_name,
      travel_date,
      travelers_count,
      special_requests
    } = req.body;

    // Basic validations
    if (!user_name || !email || !phone || !travel_date || !destination_name || !package_name) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory booking details.' });
    }

    const count = parseInt(travelers_count || 1, 10);
    if (isNaN(count) || count < 1) {
      return res.status(400).json({ success: false, message: 'Travelers count must be at least 1.' });
    }

    // Determine unit price
    let unitPrice = 0;
    if (package_id) {
      const pkgs = await db.query('SELECT price FROM tour_packages WHERE id = ?', [parseInt(package_id, 10)]);
      if (pkgs && pkgs.length > 0) {
        unitPrice = parseFloat(pkgs[0].price);
      }
    }

    if (unitPrice === 0 && destination_id) {
      const dests = await db.query('SELECT approx_cost FROM destinations WHERE id = ?', [parseInt(destination_id, 10)]);
      if (dests && dests.length > 0) {
        unitPrice = parseFloat(dests[0].approx_cost);
      }
    }

    if (unitPrice === 0) {
      unitPrice = 12000.00; // default baseline price
    }

    const totalPrice = unitPrice * count;
    const bookingRef = generateBookingRef();
    const userId = req.user ? req.user.id : null;

    const result = await db.query(
      `INSERT INTO bookings (booking_ref, user_id, package_id, destination_id, user_name, email, phone, destination_name, package_name, travel_date, travelers_count, total_price, special_requests, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingRef,
        userId,
        package_id ? parseInt(package_id, 10) : null,
        destination_id ? parseInt(destination_id, 10) : null,
        user_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        destination_name.trim(),
        package_name.trim(),
        travel_date,
        count,
        totalPrice,
        special_requests || '',
        'Pending'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Booking submitted successfully! You will receive confirmation shortly.',
      booking: {
        id: result.insertId,
        booking_ref: bookingRef,
        destination_name,
        package_name,
        travel_date,
        travelers_count: count,
        total_price: totalPrice,
        status: 'Pending'
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete booking process.' });
  }
}

/**
 * Get bookings for the authenticated user
 */
async function getMyBookings(req, res) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    let rows = await db.query('SELECT * FROM bookings WHERE user_id = ?', [userId]);

    // If no bookings matched user_id, also check if user booked by matching email
    if ((!rows || rows.length === 0) && userEmail) {
      const all = await db.query('SELECT * FROM bookings');
      rows = all.filter(b => b.email && b.email.toLowerCase() === userEmail.toLowerCase());
    }

    const now = new Date();
    // Categorize into upcoming and previous
    const bookings = rows.map(b => {
      const tripDate = new Date(b.travel_date);
      const isPast = tripDate < now && b.status !== 'Cancelled';
      return {
        ...b,
        is_past: isPast
      };
    });

    return res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve your bookings.' });
  }
}

/**
 * Cancel a booking (User action)
 */
async function cancelBooking(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const rows = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = rows[0];

    // Ensure the booking belongs to this user (unless admin)
    if (req.user.role !== 'admin' && booking.user_id !== userId && booking.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'This booking is already cancelled.' });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['Cancelled', id]);

    return res.json({
      success: true,
      message: 'Booking cancelled successfully.'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
}

/**
 * Admin: Get all bookings
 */
async function getAllBookings(req, res) {
  try {
    const rows = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error retrieving all bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
  }
}

/**
 * Admin: Update booking status
 */
async function updateBookingStatus(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const allowed = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const rows = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    return res.json({
      success: true,
      message: `Booking status updated to ${status}.`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};
