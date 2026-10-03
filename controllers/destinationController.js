/**
 * Destination Controller
 * Manages tourist destinations, searches, filtering, and admin CRUD
 */

const db = require('../config/db');

/**
 * Get all destinations with search & filter
 */
async function getAllDestinations(req, res) {
  try {
    const { search, minPrice, maxPrice, popular } = req.query;

    let rows = await db.query('SELECT * FROM destinations ORDER BY is_popular DESC, name ASC');

    // Filter in JS or SQL for uniform behavior
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      rows = rows.filter(d => 
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.location && d.location.toLowerCase().includes(q)) ||
        (d.short_desc && d.short_desc.toLowerCase().includes(q)) ||
        (d.attractions && d.attractions.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      rows = rows.filter(d => parseFloat(d.approx_cost) >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      rows = rows.filter(d => parseFloat(d.approx_cost) <= max);
    }

    if (popular === 'true' || popular === '1') {
      rows = rows.filter(d => d.is_popular == 1);
    }

    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve destinations.' });
  }
}

/**
 * Get single destination by ID along with its tour packages
 */
async function getDestinationById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const rows = await db.query('SELECT * FROM destinations WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const destination = rows[0];

    // Fetch related packages
    const allPackages = await db.query('SELECT * FROM tour_packages');
    const packages = allPackages.filter(p => 
      p.destination_id === id || 
      (p.destination_name && destination.name && p.destination_name.toLowerCase() === destination.name.toLowerCase())
    );

    return res.json({
      success: true,
      data: {
        ...destination,
        packages
      }
    });
  } catch (error) {
    console.error('Error fetching destination details:', error);
    return res.status(500).json({ success: false, message: 'Failed to load destination details.' });
  }
}

/**
 * Admin: Add new destination
 */
async function createDestination(req, res) {
  try {
    const {
      name,
      location,
      short_desc,
      detailed_desc,
      approx_cost,
      image_url,
      best_time,
      attractions,
      activities,
      travel_info,
      is_popular
    } = req.body;

    if (!name || !location || !short_desc || !approx_cost || !image_url) {
      return res.status(400).json({ success: false, message: 'Name, location, short description, approximate cost, and image URL are required.' });
    }

    const result = await db.query(
      `INSERT INTO destinations (name, location, short_desc, detailed_desc, approx_cost, image_url, best_time, attractions, activities, travel_info, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        location.trim(),
        short_desc.trim(),
        detailed_desc || short_desc,
        parseFloat(approx_cost),
        image_url.trim(),
        best_time || 'October to March',
        attractions || '',
        activities || '',
        travel_info || '',
        is_popular ? 1 : 0
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Destination added successfully.',
      destinationId: result.insertId
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    return res.status(500).json({ success: false, message: 'Failed to create destination.' });
  }
}

/**
 * Admin: Update destination
 */
async function updateDestination(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      name,
      location,
      short_desc,
      detailed_desc,
      approx_cost,
      image_url,
      best_time,
      attractions,
      activities,
      travel_info,
      is_popular
    } = req.body;

    const existing = await db.query('SELECT * FROM destinations WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const current = existing[0];

    await db.query(
      `UPDATE destinations SET name = ?, location = ?, short_desc = ?, detailed_desc = ?, approx_cost = ?, image_url = ?, best_time = ?, attractions = ?, activities = ?, travel_info = ?, is_popular = ? WHERE id = ?`,
      [
        name ? name.trim() : current.name,
        location ? location.trim() : current.location,
        short_desc ? short_desc.trim() : current.short_desc,
        detailed_desc ? detailed_desc.trim() : current.detailed_desc,
        approx_cost ? parseFloat(approx_cost) : current.approx_cost,
        image_url ? image_url.trim() : current.image_url,
        best_time ? best_time.trim() : current.best_time,
        attractions ? attractions.trim() : current.attractions,
        activities ? activities.trim() : current.activities,
        travel_info ? travel_info.trim() : current.travel_info,
        is_popular !== undefined ? (is_popular ? 1 : 0) : current.is_popular,
        id
      ]
    );

    return res.json({
      success: true,
      message: 'Destination updated successfully.'
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    return res.status(500).json({ success: false, message: 'Failed to update destination.' });
  }
}

/**
 * Admin: Delete destination
 */
async function deleteDestination(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await db.query('DELETE FROM destinations WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Destination removed successfully.'
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete destination.' });
  }
}

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};
