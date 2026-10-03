/**
 * Destinations Page Logic
 */

let allDestinations = [];

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('dest-search-input');
  const priceFilter = document.getElementById('price-filter');
  const filterPills = document.querySelectorAll('.filter-pill');

  // Check URL query for initial search parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get('search');
  if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
  }

  await fetchDestinations();

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', () => filterAndRender());
  }

  // Price select event
  if (priceFilter) {
    priceFilter.addEventListener('change', () => filterAndRender());
  }

  // Category filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterAndRender();
    });
  });
});

async function fetchDestinations() {
  const container = document.getElementById('destinations-grid');
  if (!container) return;

  try {
    const res = await apiRequest('/api/destinations');
    allDestinations = res.data;
    filterAndRender();
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger" style="grid-column: 1/-1;">Failed to load destinations. Please try again later.</p>`;
  }
}

function filterAndRender() {
  const container = document.getElementById('destinations-grid');
  const searchInput = document.getElementById('dest-search-input');
  const priceFilter = document.getElementById('price-filter');
  const activePill = document.querySelector('.filter-pill.active');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const priceVal = priceFilter ? priceFilter.value : 'all';
  const categoryVal = activePill ? activePill.dataset.filter : 'all';

  let filtered = [...allDestinations];

  // Search filter
  if (query) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.location.toLowerCase().includes(query) ||
      d.short_desc.toLowerCase().includes(query) ||
      (d.attractions && d.attractions.toLowerCase().includes(query))
    );
  }

  // Price dropdown filter
  if (priceVal === 'under-15000') {
    filtered = filtered.filter(d => parseFloat(d.approx_cost) < 15000);
  } else if (priceVal === '15000-20000') {
    filtered = filtered.filter(d => parseFloat(d.approx_cost) >= 15000 && parseFloat(d.approx_cost) <= 20000);
  } else if (priceVal === 'above-20000') {
    filtered = filtered.filter(d => parseFloat(d.approx_cost) > 20000);
  }

  // Category pill filter
  if (categoryVal === 'popular') {
    filtered = filtered.filter(d => d.is_popular == 1);
  }

  const countDisplay = document.getElementById('dest-count');
  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} destination${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
        <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
        <h3>No Destinations Found</h3>
        <p class="text-muted">Try adjusting your search criteria or resetting filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(dest => `
    <div class="destination-card">
      <div class="card-img-wrapper">
        <img src="${dest.image_url}" alt="${dest.name}" loading="lazy">
        ${dest.is_popular ? '<span class="card-badge-top popular"><i class="fas fa-fire"></i> Popular</span>' : ''}
        <span class="card-badge-category"><i class="fas fa-calendar-alt"></i> ${dest.best_time}</span>
      </div>
      <div class="card-body">
        <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${dest.location}</div>
        <h3 class="card-title">${dest.name}</h3>
        <p class="card-description">${dest.short_desc}</p>
        <div class="card-footer">
          <div>
            <span class="card-price-label">Approx. Cost</span>
            <div class="card-price-val">${formatCurrency(dest.approx_cost)}</div>
          </div>
          <a href="destination-details.html?id=${dest.id}" class="btn-custom btn-primary-gradient btn-sm-custom">
            View Details <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}
