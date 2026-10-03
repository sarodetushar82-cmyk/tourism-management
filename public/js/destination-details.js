/**
 * Destination Details Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const destId = urlParams.get('id') || 1;

  try {
    const res = await apiRequest(`/api/destinations/${destId}`);
    const dest = res.data;

    // Page title
    document.title = `${dest.name} - Tourism Management System`;

    // Populate Hero
    const heroBg = document.getElementById('details-hero');
    if (heroBg) {
      heroBg.style.backgroundImage = `url('${dest.image_url}')`;
    }

    document.getElementById('dest-title').textContent = dest.name;
    document.getElementById('dest-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${dest.location}`;
    document.getElementById('dest-cost-badge').textContent = `From ${formatCurrency(dest.approx_cost)}`;

    // Populate Overview
    document.getElementById('dest-description').textContent = dest.detailed_desc || dest.short_desc;
    document.getElementById('dest-best-time').textContent = dest.best_time;
    document.getElementById('dest-travel-info').textContent = dest.travel_info || 'Well-connected by domestic flights, major train lines, and interstate highways.';

    // Populate Attractions
    const attractionsContainer = document.getElementById('dest-attractions-list');
    if (attractionsContainer && dest.attractions) {
      const items = dest.attractions.split(',');
      attractionsContainer.innerHTML = items.map(item => `
        <span class="service-pill" style="font-size: 0.9rem; padding: 0.4rem 0.9rem;">
          <i class="fas fa-landmark"></i> ${item.trim()}
        </span>
      `).join('');
    }

    // Populate Activities
    const activitiesContainer = document.getElementById('dest-activities-list');
    if (activitiesContainer && dest.activities) {
      const activities = dest.activities.split(',');
      activitiesContainer.innerHTML = activities.map(act => `
        <div class="activity-item">
          <i class="fas fa-check-circle"></i>
          <span>${act.trim()}</span>
        </div>
      `).join('');
    }

    // Populate Quick Booking Sidebar button
    const bookBtn = document.getElementById('quick-book-btn');
    if (bookBtn) {
      bookBtn.href = `booking.html?destination_id=${dest.id}&destination_name=${encodeURIComponent(dest.name)}`;
    }
    const quickCost = document.getElementById('quick-cost');
    if (quickCost) {
      quickCost.textContent = formatCurrency(dest.approx_cost);
    }

    // Related Packages
    const packagesContainer = document.getElementById('related-packages-grid');
    if (packagesContainer) {
      if (!dest.packages || dest.packages.length === 0) {
        packagesContainer.innerHTML = `<p class="text-muted">No specific packages listed currently for this destination. You can still book a custom tour!</p>`;
      } else {
        packagesContainer.innerHTML = dest.packages.map(pkg => `
          <div class="package-card" style="box-shadow: var(--shadow-sm);">
            <div class="card-img-wrapper" style="height: 180px;">
              <img src="${pkg.image_url}" alt="${pkg.package_name}">
            </div>
            <div class="card-body" style="padding: 1.2rem;">
              <h4 style="font-size: 1.15rem; margin-bottom: 0.4rem;">${pkg.package_name}</h4>
              <div class="package-meta-row" style="margin-bottom: 0.8rem;">
                <span><i class="fas fa-clock"></i> ${pkg.duration_days}D / ${pkg.duration_nights}N</span>
              </div>
              <div class="card-footer" style="padding-top: 0.8rem;">
                <div class="card-price-val" style="font-size: 1.15rem;">${formatCurrency(pkg.price)}</div>
                <a href="booking.html?package_id=${pkg.id}&destination_name=${encodeURIComponent(dest.name)}" class="btn-custom btn-accent-gradient btn-sm-custom">
                  Book Now
                </a>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

  } catch (error) {
    showToast('Failed to load destination details.', 'error');
  }
});
