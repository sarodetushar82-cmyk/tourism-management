/**
 * Database Connection & Query Engine for Tourism Management System
 * Supports:
 * 1. Primary: Native MySQL via mysql2/promise (using .env settings)
 * 2. Fallback: Local persistent storage (so the app runs immediately even if MySQL is offline)
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const {
  defaultAdmins,
  defaultUsers,
  defaultDestinations,
  defaultPackages,
  defaultBookings,
  defaultReviews,
  defaultContactMessages
} = require('../database/seedData');

let pool = null;
let useFallback = false;
const dataDir = path.join(__dirname, '..', 'data');
const localDbFile = path.join(dataDir, 'local_db.json');

// Memory store for fallback
let fallbackStore = {
  users: [],
  admins: [],
  destinations: [],
  tour_packages: [],
  bookings: [],
  contact_messages: [],
  reviews: []
};

// Ensure data folder and fallback storage exists
function initFallbackStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(localDbFile)) {
    try {
      const data = fs.readFileSync(localDbFile, 'utf8');
      fallbackStore = JSON.parse(data);
    } catch (e) {
      console.warn('[Fallback DB] Error reading local_db.json, resetting to defaults.');
      resetFallbackStore();
    }
  } else {
    resetFallbackStore();
  }
}

function resetFallbackStore() {
  fallbackStore = {
    users: JSON.parse(JSON.stringify(defaultUsers)),
    admins: JSON.parse(JSON.stringify(defaultAdmins)),
    destinations: JSON.parse(JSON.stringify(defaultDestinations)),
    tour_packages: JSON.parse(JSON.stringify(defaultPackages)),
    bookings: JSON.parse(JSON.stringify(defaultBookings)),
    reviews: JSON.parse(JSON.stringify(defaultReviews)),
    contact_messages: JSON.parse(JSON.stringify(defaultContactMessages))
  };
  saveFallbackStorage();
}

function saveFallbackStorage() {
  try {
    fs.writeFileSync(localDbFile, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (err) {
    console.error('[Fallback DB] Failed to save local storage:', err.message);
  }
}

/**
 * Initialize Database Connection
 */
async function initDB() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true
  };

  try {
    // 1. Check if MySQL server is alive
    const tempConnection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || 'tourism_management';

    // Create database if not exists
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConnection.end();

    // 2. Connect to the specific database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log(`[MySQL] Successfully connected to MySQL database: ${dbName}`);
    useFallback = false;

    // 3. Ensure tables & seed data exist in MySQL
    await ensureMySQLTablesAndSeed();
  } catch (err) {
    console.log('\n========================================================================');
    console.log(`[DB NOTICE] Could not connect to MySQL server (${err.code || err.message}).`);
    console.log('[DB NOTICE] Operating in Persistent Standalone Demo Mode.');
    console.log('[DB NOTICE] All features, bookings, and admin tools will function seamlessly.');
    console.log('[DB NOTICE] To use MySQL: start MySQL/XAMPP and check your .env credentials.');
    console.log('========================================================================\n');

    useFallback = true;
    initFallbackStorage();
  }
}

/**
 * Ensure MySQL tables exist and seed initial data if empty
 */
async function ensureMySQLTablesAndSeed() {
  const connection = await pool.getConnection();
  try {
    // Create users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create admins
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create destinations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        short_desc TEXT NOT NULL,
        detailed_desc LONGTEXT NOT NULL,
        approx_cost DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        best_time VARCHAR(100) NOT NULL,
        attractions TEXT NOT NULL,
        activities TEXT NOT NULL,
        travel_info TEXT NOT NULL,
        is_popular TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create tour_packages
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tour_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        destination_id INT NULL,
        package_name VARCHAR(150) NOT NULL,
        destination_name VARCHAR(100) NOT NULL,
        duration_days INT NOT NULL,
        duration_nights INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        included_services TEXT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_packages_destination FOREIGN KEY (destination_id) 
          REFERENCES destinations (id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create bookings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_ref VARCHAR(20) NOT NULL UNIQUE,
        user_id INT NULL,
        package_id INT NULL,
        destination_id INT NULL,
        user_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        destination_name VARCHAR(100) NOT NULL,
        package_name VARCHAR(150) NOT NULL,
        travel_date DATE NOT NULL,
        travelers_count INT NOT NULL DEFAULT 1,
        total_price DECIMAL(10,2) NOT NULL,
        special_requests TEXT,
        status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) 
          REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_bookings_package FOREIGN KEY (package_id) 
          REFERENCES tour_packages (id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create contact_messages
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('Unread', 'Read', 'Resolved') DEFAULT 'Unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create reviews
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(100) NOT NULL,
        user_avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        destination_name VARCHAR(100) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check if destinations table is empty and seed
    const [destCount] = await connection.query('SELECT COUNT(*) as count FROM destinations');
    if (destCount[0].count === 0) {
      console.log('[MySQL] Seeding destinations and packages...');
      for (const d of defaultDestinations) {
        await connection.query(
          `INSERT INTO destinations (id, name, location, short_desc, detailed_desc, approx_cost, image_url, best_time, attractions, activities, travel_info, is_popular)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [d.id, d.name, d.location, d.short_desc, d.detailed_desc, d.approx_cost, d.image_url, d.best_time, d.attractions, d.activities, d.travel_info, d.is_popular]
        );
      }
      for (const p of defaultPackages) {
        await connection.query(
          `INSERT INTO tour_packages (id, destination_id, package_name, destination_name, duration_days, duration_nights, price, included_services, image_url, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id, p.destination_id, p.package_name, p.destination_name, p.duration_days, p.duration_nights, p.price, p.included_services, p.image_url, p.is_featured]
        );
      }
    }

    // Check admin
    const [adminCount] = await connection.query('SELECT COUNT(*) as count FROM admins');
    if (adminCount[0].count === 0) {
      for (const a of defaultAdmins) {
        await connection.query(
          `INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)`,
          [a.name, a.email, a.password, a.role]
        );
      }
    }

    // Check users
    const [usersCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (usersCount[0].count === 0) {
      for (const u of defaultUsers) {
        await connection.query(
          `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`,
          [u.name, u.email, u.phone, u.password]
        );
      }
    }

    // Check bookings
    const [bkCount] = await connection.query('SELECT COUNT(*) as count FROM bookings');
    if (bkCount[0].count === 0) {
      for (const b of defaultBookings) {
        await connection.query(
          `INSERT INTO bookings (booking_ref, user_id, package_id, destination_id, user_name, email, phone, destination_name, package_name, travel_date, travelers_count, total_price, special_requests, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [b.booking_ref, b.user_id, b.package_id, b.destination_id, b.user_name, b.email, b.phone, b.destination_name, b.package_name, b.travel_date, b.travelers_count, b.total_price, b.special_requests, b.status]
        );
      }
    }

    // Check reviews
    const [revCount] = await connection.query('SELECT COUNT(*) as count FROM reviews');
    if (revCount[0].count === 0) {
      for (const r of defaultReviews) {
        await connection.query(
          `INSERT INTO reviews (user_name, user_avatar, destination_name, rating, comment)
           VALUES (?, ?, ?, ?, ?)`,
          [r.user_name, r.user_avatar, r.destination_name, r.rating, r.comment]
        );
      }
    }

    // Check contact messages
    const [msgCount] = await connection.query('SELECT COUNT(*) as count FROM contact_messages');
    if (msgCount[0].count === 0) {
      for (const m of defaultContactMessages) {
        await connection.query(
          `INSERT INTO contact_messages (name, email, phone, subject, message, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [m.name, m.email, m.phone, m.subject, m.message, m.status]
        );
      }
    }

    console.log('[MySQL] Tables verified and initialized successfully.');
  } finally {
    connection.release();
  }
}

/**
 * Universal Query Executor
 * Automatically routes to MySQL pool or Fallback Store
 */
async function query(sql, params = []) {
  if (!useFallback && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (err) {
      console.error('[MySQL Error]', err.message);
      throw err;
    }
  }

  // Fallback Engine
  return executeFallback(sql, params);
}

/**
 * Fallback SQL-like handler for in-memory / JSON store
 */
function executeFallback(sql, params = []) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT COUNT(*)
  if (/SELECT COUNT\(\*\) as count FROM (\w+)/i.test(cleanSql)) {
    const match = cleanSql.match(/FROM (\w+)/i);
    const table = match[1].toLowerCase();
    const list = fallbackStore[table] || [];
    return [{ count: list.length }];
  }

  // 2. SELECT FROM users WHERE email = ?
  if (/FROM users WHERE email = \?/i.test(cleanSql)) {
    const user = fallbackStore.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
    return user ? [{ ...user }] : [];
  }

  // 3. SELECT FROM users WHERE id = ?
  if (/FROM users WHERE id = \?/i.test(cleanSql)) {
    const user = fallbackStore.users.find(u => u.id === parseInt(params[0], 10));
    return user ? [{ ...user }] : [];
  }

  // 4. SELECT FROM admins WHERE email = ?
  if (/FROM admins WHERE email = \?/i.test(cleanSql)) {
    const admin = fallbackStore.admins.find(a => a.email.toLowerCase() === String(params[0]).toLowerCase());
    return admin ? [{ ...admin }] : [];
  }

  // 5. SELECT all users
  if (/SELECT (.*) FROM users/i.test(cleanSql)) {
    return fallbackStore.users.map(({ password, ...rest }) => rest);
  }

  // 6. DELETE FROM users WHERE id = ?
  if (/DELETE FROM users WHERE id = \?/i.test(cleanSql)) {
    const id = parseInt(params[0], 10);
    fallbackStore.users = fallbackStore.users.filter(u => u.id !== id);
    saveFallbackStorage();
    return { affectedRows: 1 };
  }

  // 7. INSERT INTO users
  if (/INSERT INTO users/i.test(cleanSql)) {
    const newId = fallbackStore.users.length ? Math.max(...fallbackStore.users.map(u => u.id || 0)) + 1 : 1;
    const newUser = {
      id: newId,
      name: params[0],
      email: params[1],
      phone: params[2],
      password: params[3],
      created_at: new Date().toISOString()
    };
    fallbackStore.users.push(newUser);
    saveFallbackStorage();
    return { insertId: newId, affectedRows: 1 };
  }

  // 8. DESTINATIONS
  if (/SELECT (.*) FROM destinations WHERE id = \?/i.test(cleanSql)) {
    const dest = fallbackStore.destinations.find(d => d.id === parseInt(params[0], 10));
    return dest ? [{ ...dest }] : [];
  }

  if (/SELECT (.*) FROM destinations/i.test(cleanSql)) {
    let result = [...fallbackStore.destinations];
    return result;
  }

  if (/INSERT INTO destinations/i.test(cleanSql)) {
    const newId = fallbackStore.destinations.length ? Math.max(...fallbackStore.destinations.map(d => d.id || 0)) + 1 : 1;
    const newDest = {
      id: newId,
      name: params[0],
      location: params[1],
      short_desc: params[2],
      detailed_desc: params[3],
      approx_cost: parseFloat(params[4]),
      image_url: params[5],
      best_time: params[6],
      attractions: params[7],
      activities: params[8],
      travel_info: params[9],
      is_popular: parseInt(params[10] || 0, 10),
      created_at: new Date().toISOString()
    };
    fallbackStore.destinations.push(newDest);
    saveFallbackStorage();
    return { insertId: newId, affectedRows: 1 };
  }

  if (/UPDATE destinations SET/i.test(cleanSql)) {
    const id = parseInt(params[params.length - 1], 10);
    const dest = fallbackStore.destinations.find(d => d.id === id);
    if (dest) {
      dest.name = params[0];
      dest.location = params[1];
      dest.short_desc = params[2];
      dest.detailed_desc = params[3];
      dest.approx_cost = parseFloat(params[4]);
      dest.image_url = params[5];
      dest.best_time = params[6];
      dest.attractions = params[7];
      dest.activities = params[8];
      dest.travel_info = params[9];
      dest.is_popular = parseInt(params[10] || 0, 10);
      saveFallbackStorage();
    }
    return { affectedRows: dest ? 1 : 0 };
  }

  if (/DELETE FROM destinations WHERE id = \?/i.test(cleanSql)) {
    const id = parseInt(params[0], 10);
    fallbackStore.destinations = fallbackStore.destinations.filter(d => d.id !== id);
    saveFallbackStorage();
    return { affectedRows: 1 };
  }

  // 9. TOUR PACKAGES
  if (/SELECT (.*) FROM tour_packages WHERE destination_id = \?/i.test(cleanSql)) {
    const destId = parseInt(params[0], 10);
    return fallbackStore.tour_packages.filter(p => p.destination_id === destId);
  }

  if (/SELECT (.*) FROM tour_packages WHERE id = \?/i.test(cleanSql)) {
    const pkg = fallbackStore.tour_packages.find(p => p.id === parseInt(params[0], 10));
    return pkg ? [{ ...pkg }] : [];
  }

  if (/SELECT (.*) FROM tour_packages/i.test(cleanSql)) {
    return [...fallbackStore.tour_packages];
  }

  if (/INSERT INTO tour_packages/i.test(cleanSql)) {
    const newId = fallbackStore.tour_packages.length ? Math.max(...fallbackStore.tour_packages.map(p => p.id || 0)) + 1 : 1;
    const newPkg = {
      id: newId,
      destination_id: params[0] ? parseInt(params[0], 10) : null,
      package_name: params[1],
      destination_name: params[2],
      duration_days: parseInt(params[3], 10),
      duration_nights: parseInt(params[4], 10),
      price: parseFloat(params[5]),
      included_services: params[6],
      image_url: params[7],
      is_featured: parseInt(params[8] || 0, 10),
      created_at: new Date().toISOString()
    };
    fallbackStore.tour_packages.push(newPkg);
    saveFallbackStorage();
    return { insertId: newId, affectedRows: 1 };
  }

  if (/UPDATE tour_packages SET/i.test(cleanSql)) {
    const id = parseInt(params[params.length - 1], 10);
    const pkg = fallbackStore.tour_packages.find(p => p.id === id);
    if (pkg) {
      pkg.destination_id = params[0] ? parseInt(params[0], 10) : null;
      pkg.package_name = params[1];
      pkg.destination_name = params[2];
      pkg.duration_days = parseInt(params[3], 10);
      pkg.duration_nights = parseInt(params[4], 10);
      pkg.price = parseFloat(params[5]);
      pkg.included_services = params[6];
      pkg.image_url = params[7];
      pkg.is_featured = parseInt(params[8] || 0, 10);
      saveFallbackStorage();
    }
    return { affectedRows: pkg ? 1 : 0 };
  }

  if (/DELETE FROM tour_packages WHERE id = \?/i.test(cleanSql)) {
    const id = parseInt(params[0], 10);
    fallbackStore.tour_packages = fallbackStore.tour_packages.filter(p => p.id !== id);
    saveFallbackStorage();
    return { affectedRows: 1 };
  }

  // 10. BOOKINGS
  if (/SELECT (.*) FROM bookings WHERE user_id = \?/i.test(cleanSql)) {
    const uid = parseInt(params[0], 10);
    return fallbackStore.bookings
      .filter(b => b.user_id === uid)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (/SELECT (.*) FROM bookings WHERE id = \?/i.test(cleanSql)) {
    const id = parseInt(params[0], 10);
    const b = fallbackStore.bookings.find(item => item.id === id);
    return b ? [{ ...b }] : [];
  }

  if (/SELECT (.*) FROM bookings/i.test(cleanSql)) {
    return [...fallbackStore.bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (/INSERT INTO bookings/i.test(cleanSql)) {
    const newId = fallbackStore.bookings.length ? Math.max(...fallbackStore.bookings.map(b => b.id || 0)) + 1 : 1;
    const newBooking = {
      id: newId,
      booking_ref: params[0],
      user_id: params[1] ? parseInt(params[1], 10) : null,
      package_id: params[2] ? parseInt(params[2], 10) : null,
      destination_id: params[3] ? parseInt(params[3], 10) : null,
      user_name: params[4],
      email: params[5],
      phone: params[6],
      destination_name: params[7],
      package_name: params[8],
      travel_date: params[9],
      travelers_count: parseInt(params[10], 10),
      total_price: parseFloat(params[11]),
      special_requests: params[12] || '',
      status: params[13] || 'Pending',
      created_at: new Date().toISOString()
    };
    fallbackStore.bookings.unshift(newBooking);
    saveFallbackStorage();
    return { insertId: newId, affectedRows: 1 };
  }

  if (/UPDATE bookings SET status = \? WHERE id = \?/i.test(cleanSql)) {
    const status = params[0];
    const id = parseInt(params[1], 10);
    const b = fallbackStore.bookings.find(item => item.id === id);
    if (b) {
      b.status = status;
      saveFallbackStorage();
    }
    return { affectedRows: b ? 1 : 0 };
  }

  // 11. CONTACT MESSAGES
  if (/SELECT (.*) FROM contact_messages/i.test(cleanSql)) {
    return [...fallbackStore.contact_messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (/INSERT INTO contact_messages/i.test(cleanSql)) {
    const newId = fallbackStore.contact_messages.length ? Math.max(...fallbackStore.contact_messages.map(m => m.id || 0)) + 1 : 1;
    const newMsg = {
      id: newId,
      name: params[0],
      email: params[1],
      phone: params[2],
      subject: params[3],
      message: params[4],
      status: 'Unread',
      created_at: new Date().toISOString()
    };
    fallbackStore.contact_messages.unshift(newMsg);
    saveFallbackStorage();
    return { insertId: newId, affectedRows: 1 };
  }

  if (/DELETE FROM contact_messages WHERE id = \?/i.test(cleanSql)) {
    const id = parseInt(params[0], 10);
    fallbackStore.contact_messages = fallbackStore.contact_messages.filter(m => m.id !== id);
    saveFallbackStorage();
    return { affectedRows: 1 };
  }

  if (/UPDATE contact_messages SET status = \? WHERE id = \?/i.test(cleanSql)) {
    const status = params[0];
    const id = parseInt(params[1], 10);
    const m = fallbackStore.contact_messages.find(item => item.id === id);
    if (m) {
      m.status = status;
      saveFallbackStorage();
    }
    return { affectedRows: m ? 1 : 0 };
  }

  // 12. REVIEWS
  if (/SELECT (.*) FROM reviews/i.test(cleanSql)) {
    return [...fallbackStore.reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (/INSERT INTO reviews/i.test(cleanSql)) {
    const newId = fallbackStore.reviews.length ? Math.max(...fallbackStore.reviews.map(r => r.id || 0)) + 1 : 1;
    const newRev = {
      id: newId,
      user_name: params[0],
      user_avatar: params[1] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      destination_name: params[2],
      rating: parseInt(params[3], 10),
      comment: params[4],
      created_at: new Date().toISOString()
    };
    fallbackStore.reviews.unshift(newRev);
    saveFallbackStorage();
    return { insertId: newId, affectedRows: 1 };
  }

  console.warn('[Fallback DB] Unhandled SQL:', cleanSql);
  return [];
}

module.exports = {
  initDB,
  query,
  isUsingFallback: () => useFallback
};
