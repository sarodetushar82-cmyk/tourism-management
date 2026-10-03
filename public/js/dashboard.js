/**
 * User Dashboard Logic
 */

let myBookings = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Check if authenticated
  if (!Auth.isLoggedIn()) {
    showToast('Please sign in to access your dashboard.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  const user = Auth.getUser();

  // Populate user profile info
  if (document.getElementById('dash-user-name')) document.getElementById('dash-user-name').textContent = user.name;
  if (document.getElementById('dash-user-email')) document.getElementById('dash-user-email').textContent = user.email;
  if (document.getElementById('dash-user-phone')) document.getElementById('dash-user-phone').textContent = user.phone || 'Not provided';
  if (document.getElementById('dash-avatar-letter')) document.getElementById('dash-avatar-letter').textContent = user.name.charAt(0).toUpperCase();

  await fetchUserBookings();

  // Booking tab switcher
  const tabs = document.querySelectorAll('.dash-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderBookings(tab.dataset.tab);
    });
  });
});

async function fetchUserBookings() {
  const container = document.getElementById('user-bookings-list');
  if (!container) return;

  try {
    const res = await apiRequest('/api/bookings/my-bookings', 'GET', null, true);
    myBookings = res.data;

    // Calculate metrics
    const total = myBookings.length;
    const upcoming = myBookings.filter(b => !b.is_past && b.status !== 'Cancelled').length;
    const completed = myBookings.filter(b => b.status === 'Completed' || b.is_past && b.status !== 'Cancelled').length;
    const cancelled = myBookings.filter(b => b.status === 'Cancelled').length;

    if (document.getElementById('stat-total-trips')) document.getElementById('stat-total-trips').textContent = total;
    if (document.getElementById('stat-upcoming-trips')) document.getElementById('stat-upcoming-trips').textContent = upcoming;
    if (document.getElementById('stat-completed-trips')) document.getElementById('stat-completed-trips').textContent = completed;
    if (document.getElementById('stat-cancelled-trips')) document.getElementById('stat-cancelled-trips').textContent = cancelled;

    renderBookings('all');
  } catch (error) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: #ef4444;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
        <p>Failed to load your bookings. ${error.message}</p>
      </div>
    `;
  }
}

function renderBookings(filter = 'all') {
  const container = document.getElementById('user-bookings-list');
  if (!container) return;

  let list = [...myBookings];

  if (filter === 'upcoming') {
    list = list.filter(b => !b.is_past && b.status !== 'Cancelled');
  } else if (filter === 'past') {
    list = list.filter(b => b.is_past || b.status === 'Completed');
  } else if (filter === 'cancelled') {
    list = list.filter(b => b.status === 'Cancelled');
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1.5rem; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <i class="fas fa-plane-departure" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
        <h4>No Bookings Found in this Category</h4>
        <p class="text-muted" style="margin-bottom: 1.5rem;">Explore our curated destinations and start planning your next vacation.</p>
        <a href="packages.html" class="btn-custom btn-primary-gradient">Explore Tour Packages</a>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => {
    let statusClass = 'pending';
    if (b.status === 'Confirmed') statusClass = 'confirmed';
    if (b.status === 'Cancelled') statusClass = 'cancelled';
    if (b.status === 'Completed') statusClass = 'completed';

    const canCancel = b.status !== 'Cancelled' && b.status !== 'Completed';

    return `
      <div class="user-booking-card" style="background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.82rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              Booking Reference: <strong>${b.booking_ref}</strong>
            </div>
            <h3 style="font-size: 1.35rem; margin-top: 0.25rem; color: var(--text-main);">${b.package_name}</h3>
            <div style="color: var(--text-muted); font-size: 0.9rem;">
              <i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${b.destination_name}
            </div>
          </div>
          <div>
            <span class="badge-status ${statusClass}">${b.status}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; background: var(--bg-body); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
          <div>
            <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Travel Date</span>
            <div style="font-weight: 700; font-size: 0.95rem;"><i class="fas fa-calendar-alt"></i> ${b.travel_date}</div>
          </div>
          <div>
            <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Travelers</span>
            <div style="font-weight: 700; font-size: 0.95rem;"><i class="fas fa-users"></i> ${b.travelers_count} Person(s)</div>
          </div>
          <div>
            <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Total Cost</span>
            <div style="font-weight: 800; font-size: 1.15rem; color: var(--primary);">${formatCurrency(b.total_price)}</div>
          </div>
          <div>
            <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Booked On</span>
            <div style="font-size: 0.88rem; color: var(--text-muted);">${new Date(b.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        ${b.special_requests ? `
          <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem; padding: 0.6rem 0.9rem; background: #fffbeb; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;">
            <strong>Special Requests:</strong> ${b.special_requests}
          </div>
        ` : ''}

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          ${canCancel ? `
            <button onclick="confirmCancelBooking(${b.id})" class="btn-custom btn-outline-custom btn-sm-custom" style="color: #ef4444; border-color: #fca5a5;">
              <i class="fas fa-times-circle"></i> Cancel Booking
            </button>
          ` : ''}
          <a href="destination-details.html?id=${b.destination_id || 1}" class="btn-custom btn-outline-custom btn-sm-custom">
            <i class="fas fa-info-circle"></i> Destination Info
          </a>
        </div>
      </div>
    `;
  }).join('');
}

async function confirmCancelBooking(bookingId) {
  if (!confirm('Are you sure you wish to cancel this tour booking? This action cannot be undone.')) {
    return;
  }

  try {
    await apiRequest(`/api/bookings/${bookingId}/cancel`, 'PUT', null, true);
    showToast('Your booking has been cancelled successfully.', 'success');
    await fetchUserBookings();
  } catch (error) {
    showToast(error.message || 'Failed to cancel booking.', 'error');
  }
}
