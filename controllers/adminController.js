/**
 * Admin Controller
 * Provides overarching statistics, metrics, and user management for the Admin Panel
 */

const db = require('../config/db');

/**
 * Get Admin Dashboard Overview Statistics
 */
async function getDashboardStats(req, res) {
  try {
    const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [bookingsCount] = await db.query('SELECT COUNT(*) as count FROM bookings');
    const [destCount] = await db.query('SELECT COUNT(*) as count FROM destinations');
    const [pkgCount] = await db.query('SELECT COUNT(*) as count FROM tour_packages');
    const [msgCount] = await db.query('SELECT COUNT(*) as count FROM contact_messages');

    // Calculate revenue from active bookings
    const allBookings = await db.query('SELECT * FROM bookings');
    const revenue = allBookings
      .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
      .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

    const pendingBookings = allBookings.filter(b => b.status === 'Pending').length;

    // Recent 5 bookings
    const recentBookings = [...allBookings]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    // Recent 5 messages
    const allMessages = await db.query('SELECT * FROM contact_messages');
    const recentMessages = [...allMessages]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    return res.json({
      success: true,
      stats: {
        totalUsers: usersCount ? usersCount.count : 0,
        totalBookings: bookingsCount ? bookingsCount.count : 0,
        totalDestinations: destCount ? destCount.count : 0,
        totalPackages: pkgCount ? pkgCount.count : 0,
        totalMessages: msgCount ? msgCount.count : 0,
        pendingBookings,
        totalRevenue: revenue
      },
      recentBookings,
      recentMessages
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    return res.status(500).json({ success: false, message: 'Failed to compile admin statistics.' });
  }
}

/**
 * Admin: List all registered users
 */
async function getAllUsers(req, res) {
  try {
    const users = await db.query('SELECT id, name, email, phone, created_at FROM users');
    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve registered users.' });
  }
}

/**
 * Admin: Delete user
 */
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'User removed successfully.'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser
};
