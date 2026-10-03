/**
 * Tour Packages Page Logic
 */

let allPackages = [];

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('pkg-search-input');
  const destSelect = document.getElementById('pkg-dest-filter');
  const durationSelect = document.getElementById('pkg-duration-filter');
  const priceSelect = document.getElementById('pkg-price-filter');

  await fetchPackages();

  // Populate Destination dropdown options dynamically
  populateDestinationFilter();

  if (searchInput) searchInput.addEventListener('input', filterAndRenderPackages);
  if (destSelect) destSelect.addEventListener('change', filterAndRenderPackages);
  if (durationSelect) durationSelect.addEventListener('change', filterAndRenderPackages);
  if (priceSelect) priceSelect.addEventListener('change', filterAndRenderPackages);
});

async function fetchPackages() {
  const container = document.getElementById('packages-grid');
  if (!container) return;

  try {
    const res = await apiRequest('/api/packages');
    allPackages = res.data;
    filterAndRenderPackages();
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger" style="grid-column: 1/-1;">Failed to load tour packages.</p>`;
  }
}

function populateDestinationFilter() {
  const destSelect = document.getElementById('pkg-dest-filter');
  if (!destSelect) return;

  const destinations = [...new Set(allPackages.map(p => p.destination_name))].filter(Boolean);
  destinations.sort();

  destinations.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    destSelect.appendChild(opt);
  });
}

function filterAndRenderPackages() {
  const container = document.getElementById('packages-grid');
  const searchInput = document.getElementById('pkg-search-input');
  const destSelect = document.getElementById('pkg-dest-filter');
  const durationSelect = document.getElementById('pkg-duration-filter');
  const priceSelect = document.getElementById('pkg-price-filter');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const destVal = destSelect ? destSelect.value : 'all';
  const durationVal = durationSelect ? durationSelect.value : 'all';
  const priceVal = priceSelect ? priceSelect.value : 'all';

  let filtered = [...allPackages];

  if (query) {
    filtered = filtered.filter(p =>
      p.package_name.toLowerCase().includes(query) ||
      p.destination_name.toLowerCase().includes(query) ||
      p.included_services.toLowerCase().includes(query)
    );
  }

  if (destVal !== 'all') {
    filtered = filtered.filter(p => p.destination_name === destVal);
  }

  if (durationVal === 'short') {
    filtered = filtered.filter(p => p.duration_days <= 4);
  } else if (durationVal === 'medium') {
    filtered = filtered.filter(p => p.duration_days >= 5 && p.duration_days <= 6);
  } else if (durationVal === 'long') {
    filtered = filtered.filter(p => p.duration_days >= 7);
  }

  if (priceVal === 'under-15000') {
    filtered = filtered.filter(p => parseFloat(p.price) < 15000);
  } else if (priceVal === '15000-25000') {
    filtered = filtered.filter(p => parseFloat(p.price) >= 15000 && parseFloat(p.price) <= 25000);
  } else if (priceVal === 'above-25000') {
    filtered = filtered.filter(p => parseFloat(p.price) > 25000);
  }

  const countDisplay = document.getElementById('pkg-count');
  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} package${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
        <i class="fas fa-suitcase-rolling" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
        <h3>No Packages Found</h3>
        <p class="text-muted">No tour packages match your selected filters. Try broadening your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(pkg => {
    const services = pkg.included_services.split(',').slice(0, 4);
    return `
      <div class="package-card">
        <div class="card-img-wrapper">
          <img src="${pkg.image_url}" alt="${pkg.package_name}" loading="lazy">
          ${pkg.is_featured ? '<span class="card-badge-top popular"><i class="fas fa-star"></i> Featured</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${pkg.destination_name}</div>
          <h3 class="card-title">${pkg.package_name}</h3>
          
          <div class="package-meta-row">
            <span class="package-meta-item"><i class="fas fa-calendar-day"></i> ${pkg.duration_days} Days</span>
            <span class="package-meta-item"><i class="fas fa-moon"></i> ${pkg.duration_nights} Nights</span>
          </div>

          <div class="services-tags">
            ${services.map(s => `<span class="service-pill"><i class="fas fa-check"></i> ${s.trim()}</span>`).join('')}
          </div>

          <div class="card-footer">
            <div>
              <span class="card-price-label">Price per person</span>
              <div class="card-price-val">${formatCurrency(pkg.price)}</div>
            </div>
            <a href="booking.html?package_id=${pkg.id}&destination_name=${encodeURIComponent(pkg.destination_name)}" class="btn-custom btn-accent-gradient btn-sm-custom">
              Book Now <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
