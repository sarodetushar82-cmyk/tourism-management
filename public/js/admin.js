/**
 * Admin Dashboard Logic
 * Full CRUD for Destinations, Packages, Bookings, Users, and Inquiries
 */

let adminStats = {};
let adminDestinations = [];
let adminPackages = [];
let adminBookings = [];
let adminUsers = [];
let adminMessages = [];

let editingDestinationId = null;
let editingPackageId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Security Guard: Check Admin Access
  if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
    showToast('Administrator privileges required. Please sign in.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  // Setup Admin Navigation Switching
  const navItems = document.querySelectorAll('.admin-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (!section) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.admin-section-view').forEach(s => s.style.display = 'none');
      const target = document.getElementById(`section-${section}`);
      if (target) target.style.display = 'block';

      // Load section data
      if (section === 'overview') loadAdminOverview();
      else if (section === 'destinations') loadAdminDestinations();
      else if (section === 'packages') loadAdminPackages();
      else if (section === 'bookings') loadAdminBookings();
      else if (section === 'users') loadAdminUsers();
      else if (section === 'messages') loadAdminMessages();
    });
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Destination Form Submit
  const destForm = document.getElementById('dest-form');
  if (destForm) destForm.addEventListener('submit', handleDestinationSubmit);

  // Package Form Submit
  const pkgForm = document.getElementById('pkg-form');
  if (pkgForm) pkgForm.addEventListener('submit', handlePackageSubmit);

  // Initial load
  await loadAdminOverview();
});

// ==========================================
// 1. OVERVIEW
// ==========================================
async function loadAdminOverview() {
  try {
    const res = await apiRequest('/api/admin/stats', 'GET', null, true);
    adminStats = res.stats;

    document.getElementById('stat-total-users').textContent = adminStats.totalUsers;
    document.getElementById('stat-total-bookings').textContent = adminStats.totalBookings;
    document.getElementById('stat-total-destinations').textContent = adminStats.totalDestinations;
    document.getElementById('stat-total-packages').textContent = adminStats.totalPackages;
    document.getElementById('stat-total-revenue').textContent = formatCurrency(adminStats.totalRevenue);
    document.getElementById('stat-pending-bookings').textContent = adminStats.pendingBookings;

    // Render Recent Bookings Table
    const recentBkContainer = document.getElementById('recent-bookings-tbody');
    if (recentBkContainer && res.recentBookings) {
      if (res.recentBookings.length === 0) {
        recentBkContainer.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No bookings recorded yet.</td></tr>`;
      } else {
        recentBkContainer.innerHTML = res.recentBookings.map(b => `
          <tr>
            <td><strong>${b.booking_ref}</strong></td>
            <td>${b.user_name}</td>
            <td>${b.destination_name}</td>
            <td>${formatCurrency(b.total_price)}</td>
            <td><span class="badge-status ${b.status.toLowerCase()}">${b.status}</span></td>
          </tr>
        `).join('');
      }
    }

    // Render Recent Messages Table
    const recentMsgContainer = document.getElementById('recent-messages-tbody');
    if (recentMsgContainer && res.recentMessages) {
      if (res.recentMessages.length === 0) {
        recentMsgContainer.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No messages received yet.</td></tr>`;
      } else {
        recentMsgContainer.innerHTML = res.recentMessages.map(m => `
          <tr>
            <td><strong>${m.name}</strong></td>
            <td>${m.email}</td>
            <td>${m.subject}</td>
            <td><span class="badge-status ${m.status === 'Unread' ? 'pending' : 'confirmed'}">${m.status}</span></td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    showToast('Failed to load dashboard overview.', 'error');
  }
}

// ==========================================
// 2. DESTINATIONS MANAGEMENT
// ==========================================
async function loadAdminDestinations() {
  const tbody = document.getElementById('destinations-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading destinations...</td></tr>`;

  try {
    const res = await apiRequest('/api/destinations');
    adminDestinations = res.data;

    if (adminDestinations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No destinations found. Click "+ Add Destination" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = adminDestinations.map(d => `
      <tr>
        <td>
          <img src="${d.image_url}" alt="${d.name}" class="table-img" onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100'">
        </td>
        <td><strong>${d.name}</strong></td>
        <td><i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${d.location}</td>
        <td>${formatCurrency(d.approx_cost)}</td>
        <td>${d.best_time}</td>
        <td>
          ${d.is_popular ? '<span class="badge-status confirmed"><i class="fas fa-fire"></i> Popular</span>' : '<span class="badge-status pending">Standard</span>'}
        </td>
        <td>
          <div class="table-actions">
            <button onclick="openEditDestinationModal(${d.id})" class="btn-icon edit" title="Edit Destination">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="confirmDeleteDestination(${d.id})" class="btn-icon delete" title="Delete Destination">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading destinations.</td></tr>`;
  }
}

function openAddDestinationModal() {
  editingDestinationId = null;
  document.getElementById('dest-modal-title').textContent = 'Add New Destination';
  document.getElementById('dest-form').reset();
  document.getElementById('dest-modal').classList.add('active');
}

function openEditDestinationModal(id) {
  const dest = adminDestinations.find(d => d.id === id);
  if (!dest) return;

  editingDestinationId = id;
  document.getElementById('dest-modal-title').textContent = `Edit Destination: ${dest.name}`;
  document.getElementById('dest-name').value = dest.name;
  document.getElementById('dest-location-input').value = dest.location;
  document.getElementById('dest-approx-cost').value = dest.approx_cost;
  document.getElementById('dest-best-time-input').value = dest.best_time || '';
  document.getElementById('dest-image-url').value = dest.image_url;
  document.getElementById('dest-short-desc').value = dest.short_desc;
  document.getElementById('dest-detailed-desc').value = dest.detailed_desc || '';
  document.getElementById('dest-attractions-input').value = dest.attractions || '';
  document.getElementById('dest-activities-input').value = dest.activities || '';
  document.getElementById('dest-travel-info-input').value = dest.travel_info || '';
  document.getElementById('dest-is-popular').checked = dest.is_popular == 1;

  document.getElementById('dest-modal').classList.add('active');
}

async function handleDestinationSubmit(e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById('dest-name').value.trim(),
    location: document.getElementById('dest-location-input').value.trim(),
    approx_cost: parseFloat(document.getElementById('dest-approx-cost').value),
    best_time: document.getElementById('dest-best-time-input').value.trim(),
    image_url: document.getElementById('dest-image-url').value.trim(),
    short_desc: document.getElementById('dest-short-desc').value.trim(),
    detailed_desc: document.getElementById('dest-detailed-desc').value.trim(),
    attractions: document.getElementById('dest-attractions-input').value.trim(),
    activities: document.getElementById('dest-activities-input').value.trim(),
    travel_info: document.getElementById('dest-travel-info-input').value.trim(),
    is_popular: document.getElementById('dest-is-popular').checked ? 1 : 0
  };

  try {
    if (editingDestinationId) {
      await apiRequest(`/api/destinations/${editingDestinationId}`, 'PUT', payload, true);
      showToast('Destination updated successfully.', 'success');
    } else {
      await apiRequest('/api/destinations', 'POST', payload, true);
      showToast('New destination added successfully.', 'success');
    }

    document.getElementById('dest-modal').classList.remove('active');
    loadAdminDestinations();
  } catch (error) {
    showToast(error.message || 'Operation failed.', 'error');
  }
}

async function confirmDeleteDestination(id) {
  if (!confirm('Are you sure you want to delete this destination? This cannot be undone.')) return;

  try {
    await apiRequest(`/api/destinations/${id}`, 'DELETE', null, true);
    showToast('Destination deleted successfully.', 'success');
    loadAdminDestinations();
  } catch (error) {
    showToast('Failed to delete destination.', 'error');
  }
}

// ==========================================
// 3. TOUR PACKAGES MANAGEMENT
// ==========================================
async function loadAdminPackages() {
  const tbody = document.getElementById('packages-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading tour packages...</td></tr>`;

  try {
    const res = await apiRequest('/api/packages');
    adminPackages = res.data;

    if (adminPackages.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No tour packages found. Click "+ Add Tour Package" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = adminPackages.map(p => `
      <tr>
        <td>
          <img src="${p.image_url}" alt="${p.package_name}" class="table-img" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100'">
        </td>
        <td><strong>${p.package_name}</strong></td>
        <td><i class="fas fa-compass" style="color: var(--primary);"></i> ${p.destination_name}</td>
        <td>${p.duration_days}D / ${p.duration_nights}N</td>
        <td><strong>${formatCurrency(p.price)}</strong></td>
        <td>
          ${p.is_featured ? '<span class="badge-status confirmed"><i class="fas fa-star"></i> Featured</span>' : '<span class="badge-status pending">Standard</span>'}
        </td>
        <td>
          <div class="table-actions">
            <button onclick="openEditPackageModal(${p.id})" class="btn-icon edit" title="Edit Package">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="confirmDeletePackage(${p.id})" class="btn-icon delete" title="Delete Package">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading packages.</td></tr>`;
  }
}

function openAddPackageModal() {
  editingPackageId = null;
  document.getElementById('pkg-modal-title').textContent = 'Add New Tour Package';
  document.getElementById('pkg-form').reset();
  document.getElementById('pkg-modal').classList.add('active');
}

function openEditPackageModal(id) {
  const pkg = adminPackages.find(p => p.id === id);
  if (!pkg) return;

  editingPackageId = id;
  document.getElementById('pkg-modal-title').textContent = `Edit Package: ${pkg.package_name}`;
  document.getElementById('pkg-name-input').value = pkg.package_name;
  document.getElementById('pkg-dest-name-input').value = pkg.destination_name;
  document.getElementById('pkg-days-input').value = pkg.duration_days;
  document.getElementById('pkg-nights-input').value = pkg.duration_nights;
  document.getElementById('pkg-price-input').value = pkg.price;
  document.getElementById('pkg-image-input').value = pkg.image_url;
  document.getElementById('pkg-services-input').value = pkg.included_services;
  document.getElementById('pkg-is-featured').checked = pkg.is_featured == 1;

  document.getElementById('pkg-modal').classList.add('active');
}

async function handlePackageSubmit(e) {
  e.preventDefault();

  const payload = {
    package_name: document.getElementById('pkg-name-input').value.trim(),
    destination_name: document.getElementById('pkg-dest-name-input').value.trim(),
    duration_days: parseInt(document.getElementById('pkg-days-input').value, 10),
    duration_nights: parseInt(document.getElementById('pkg-nights-input').value, 10),
    price: parseFloat(document.getElementById('pkg-price-input').value),
    image_url: document.getElementById('pkg-image-input').value.trim(),
    included_services: document.getElementById('pkg-services-input').value.trim(),
    is_featured: document.getElementById('pkg-is-featured').checked ? 1 : 0
  };

  try {
    if (editingPackageId) {
      await apiRequest(`/api/packages/${editingPackageId}`, 'PUT', payload, true);
      showToast('Tour package updated successfully.', 'success');
    } else {
      await apiRequest('/api/packages', 'POST', payload, true);
      showToast('New tour package created successfully.', 'success');
    }

    document.getElementById('pkg-modal').classList.remove('active');
    loadAdminPackages();
  } catch (error) {
    showToast(error.message || 'Operation failed.', 'error');
  }
}

async function confirmDeletePackage(id) {
  if (!confirm('Are you sure you want to delete this tour package?')) return;

  try {
    await apiRequest(`/api/packages/${id}`, 'DELETE', null, true);
    showToast('Package deleted successfully.', 'success');
    loadAdminPackages();
  } catch (error) {
    showToast('Failed to delete tour package.', 'error');
  }
}

// ==========================================
// 4. BOOKINGS MANAGEMENT
// ==========================================
async function loadAdminBookings() {
  const tbody = document.getElementById('bookings-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="8" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading bookings...</td></tr>`;

  try {
    const res = await apiRequest('/api/bookings/admin/all', 'GET', null, true);
    adminBookings = res.data;

    if (adminBookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No customer bookings have been placed yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = adminBookings.map(b => `
      <tr>
        <td><strong>${b.booking_ref}</strong></td>
        <td>
          <div style="font-weight: 700;">${b.user_name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${b.email} | ${b.phone}</div>
        </td>
        <td>${b.destination_name}</td>
        <td>${b.travel_date}</td>
        <td>${b.travelers_count} person(s)</td>
        <td><strong>${formatCurrency(b.total_price)}</strong></td>
        <td>
          <select onchange="updateBookingStatus(${b.id}, this.value)" class="form-control-custom" style="padding: 0.35rem 0.65rem; font-size: 0.82rem; width: auto; font-weight: 600;">
            <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button onclick="viewBookingDetails(${b.id})" class="btn-icon" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error retrieving bookings.</td></tr>`;
  }
}

async function updateBookingStatus(id, newStatus) {
  try {
    await apiRequest(`/api/bookings/admin/${id}/status`, 'PUT', { status: newStatus }, true);
    showToast(`Booking status updated to ${newStatus}.`, 'success');
  } catch (error) {
    showToast('Failed to update booking status.', 'error');
  }
}

function viewBookingDetails(id) {
  const b = adminBookings.find(item => item.id === id);
  if (!b) return;

  alert(`
=== BOOKING DETAILS ===
Ref: ${b.booking_ref}
Customer: ${b.user_name}
Email: ${b.email}
Phone: ${b.phone}
Package: ${b.package_name}
Destination: ${b.destination_name}
Travel Date: ${b.travel_date}
Travelers: ${b.travelers_count}
Total Cost: ₹${b.total_price}
Status: ${b.status}
Special Requests: ${b.special_requests || 'None'}
  `);
}

// ==========================================
// 5. REGISTERED USERS MANAGEMENT
// ==========================================
async function loadAdminUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading users...</td></tr>`;

  try {
    const res = await apiRequest('/api/admin/users', 'GET', null, true);
    adminUsers = res.data;

    if (adminUsers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No registered users found.</td></tr>`;
      return;
    }

    tbody.innerHTML = adminUsers.map(u => `
      <tr>
        <td>#${u.id}</td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td>${new Date(u.created_at).toLocaleDateString()}</td>
        <td>
          <button onclick="confirmDeleteUser(${u.id})" class="btn-icon delete" title="Delete User">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error retrieving users.</td></tr>`;
  }
}

async function confirmDeleteUser(id) {
  if (!confirm('Are you sure you want to remove this user account?')) return;

  try {
    await apiRequest(`/api/admin/users/${id}`, 'DELETE', null, true);
    showToast('User account removed.', 'success');
    loadAdminUsers();
  } catch (error) {
    showToast('Failed to delete user.', 'error');
  }
}

// ==========================================
// 6. CONTACT INQUIRIES MANAGEMENT
// ==========================================
async function loadAdminMessages() {
  const tbody = document.getElementById('messages-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading messages...</td></tr>`;

  try {
    const res = await apiRequest('/api/contact/admin/all', 'GET', null, true);
    adminMessages = res.data;

    if (adminMessages.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No contact messages received.</td></tr>`;
      return;
    }

    tbody.innerHTML = adminMessages.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td>
          <div>${m.email}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${m.phone || ''}</div>
        </td>
        <td>${m.subject}</td>
        <td>
          <span class="badge-status ${m.status === 'Unread' ? 'pending' : (m.status === 'Resolved' ? 'completed' : 'confirmed')}">
            ${m.status}
          </span>
        </td>
        <td>${new Date(m.created_at).toLocaleDateString()}</td>
        <td>
          <div class="table-actions">
            <button onclick="viewMessageModal(${m.id})" class="btn-icon" title="View Full Message">
              <i class="fas fa-envelope-open-text"></i>
            </button>
            <button onclick="confirmDeleteMessage(${m.id})" class="btn-icon delete" title="Delete Message">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error retrieving messages.</td></tr>`;
  }
}

function viewMessageModal(id) {
  const msg = adminMessages.find(m => m.id === id);
  if (!msg) return;

  document.getElementById('view-msg-name').textContent = msg.name;
  document.getElementById('view-msg-email').textContent = msg.email;
  document.getElementById('view-msg-phone').textContent = msg.phone || 'N/A';
  document.getElementById('view-msg-subject').textContent = msg.subject;
  document.getElementById('view-msg-body').textContent = msg.message;
  document.getElementById('reply-email-btn').href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`;

  // Mark as Read
  if (msg.status === 'Unread') {
    apiRequest(`/api/contact/admin/${id}/status`, 'PUT', { status: 'Read' }, true);
    msg.status = 'Read';
  }

  document.getElementById('message-modal').classList.add('active');
}

async function confirmDeleteMessage(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;

  try {
    await apiRequest(`/api/contact/admin/${id}`, 'DELETE', null, true);
    showToast('Message deleted successfully.', 'success');
    loadAdminMessages();
  } catch (error) {
    showToast('Failed to delete message.', 'error');
  }
}
