/**
 * Tour Package Controller
 * Handles package listings, filtering by price/duration/destination, and admin CRUD
 */

const db = require('../config/db');

/**
 * Get all tour packages with filtering
 */
async function getAllPackages(req, res) {
  try {
    const { search, destination, minPrice, maxPrice, duration, featured } = req.query;

    let rows = await db.query('SELECT * FROM tour_packages ORDER BY is_featured DESC, id ASC');

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      rows = rows.filter(p =>
        (p.package_name && p.package_name.toLowerCase().includes(q)) ||
        (p.destination_name && p.destination_name.toLowerCase().includes(q)) ||
        (p.included_services && p.included_services.toLowerCase().includes(q))
      );
    }

    if (destination && destination.trim() !== '' && destination.toLowerCase() !== 'all') {
      const dest = destination.toLowerCase().trim();
      rows = rows.filter(p => p.destination_name && p.destination_name.toLowerCase() === dest);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      rows = rows.filter(p => parseFloat(p.price) >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      rows = rows.filter(p => parseFloat(p.price) <= max);
    }

    if (duration && duration !== 'all') {
      const days = parseInt(duration, 10);
      if (!isNaN(days)) {
        if (days >= 7) {
          rows = rows.filter(p => p.duration_days >= 7);
        } else {
          rows = rows.filter(p => p.duration_days === days);
        }
      }
    }

    if (featured === 'true' || featured === '1') {
      rows = rows.filter(p => p.is_featured == 1);
    }

    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve tour packages.' });
  }
}

/**
 * Get package by ID
 */
async function getPackageById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const rows = await db.query('SELECT * FROM tour_packages WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }

    return res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching package details:', error);
    return res.status(500).json({ success: false, message: 'Failed to load package details.' });
  }
}

/**
 * Admin: Create tour package
 */
async function createPackage(req, res) {
  try {
    const {
      destination_id,
      package_name,
      destination_name,
      duration_days,
      duration_nights,
      price,
      included_services,
      image_url,
      is_featured
    } = req.body;

    if (!package_name || !destination_name || !duration_days || !price || !included_services) {
      return res.status(400).json({ success: false, message: 'Please provide all required package details.' });
    }

    const result = await db.query(
      `INSERT INTO tour_packages (destination_id, package_name, destination_name, duration_days, duration_nights, price, included_services, image_url, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        destination_id ? parseInt(destination_id, 10) : null,
        package_name.trim(),
        destination_name.trim(),
        parseInt(duration_days, 10),
        parseInt(duration_nights || Math.max(1, duration_days - 1), 10),
        parseFloat(price),
        included_services.trim(),
        image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        is_featured ? 1 : 0
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Tour package created successfully.',
      packageId: result.insertId
    });
  } catch (error) {
    console.error('Error creating tour package:', error);
    return res.status(500).json({ success: false, message: 'Failed to create tour package.' });
  }
}

/**
 * Admin: Update tour package
 */
async function updatePackage(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      destination_id,
      package_name,
      destination_name,
      duration_days,
      duration_nights,
      price,
      included_services,
      image_url,
      is_featured
    } = req.body;

    const existing = await db.query('SELECT * FROM tour_packages WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }

    const current = existing[0];

    await db.query(
      `UPDATE tour_packages SET destination_id = ?, package_name = ?, destination_name = ?, duration_days = ?, duration_nights = ?, price = ?, included_services = ?, image_url = ?, is_featured = ? WHERE id = ?`,
      [
        destination_id !== undefined ? (destination_id ? parseInt(destination_id, 10) : null) : current.destination_id,
        package_name ? package_name.trim() : current.package_name,
        destination_name ? destination_name.trim() : current.destination_name,
        duration_days ? parseInt(duration_days, 10) : current.duration_days,
        duration_nights ? parseInt(duration_nights, 10) : current.duration_nights,
        price ? parseFloat(price) : current.price,
        included_services ? included_services.trim() : current.included_services,
        image_url ? image_url.trim() : current.image_url,
        is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured,
        id
      ]
    );

    return res.json({
      success: true,
      message: 'Tour package updated successfully.'
    });
  } catch (error) {
    console.error('Error updating tour package:', error);
    return res.status(500).json({ success: false, message: 'Failed to update tour package.' });
  }
}

/**
 * Admin: Delete tour package
 */
async function deletePackage(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await db.query('DELETE FROM tour_packages WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Package removed successfully.'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete package.' });
  }
}

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};
