/**
 * Home Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Hero Search Handler
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const heroSearchInput = document.getElementById('hero-search-input');

  if (heroSearchBtn && heroSearchInput) {
    const handleSearch = () => {
      const query = heroSearchInput.value.trim();
      if (query) {
        window.location.href = `destinations.html?search=${encodeURIComponent(query)}`;
      } else {
        window.location.href = 'destinations.html';
      }
    };

    heroSearchBtn.addEventListener('click', handleSearch);
    heroSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // Load Popular Destinations
  loadPopularDestinations();

  // Load Featured Packages
  loadFeaturedPackages();

  // Load Reviews
  loadCustomerReviews();
});

async function loadPopularDestinations() {
  const container = document.getElementById('popular-destinations-grid');
  if (!container) return;

  try {
    const res = await apiRequest('/api/destinations?popular=true');
    const destinations = res.data.slice(0, 4);

    if (destinations.length === 0) {
      container.innerHTML = `<p class="text-center text-muted" style="grid-column: 1/-1;">No destinations available yet.</p>`;
      return;
    }

    container.innerHTML = destinations.map(dest => `
      <div class="destination-card">
        <div class="card-img-wrapper">
          <img src="${dest.image_url}" alt="${dest.name}" loading="lazy">
          <span class="card-badge-top popular"><i class="fas fa-fire"></i> Popular</span>
          <span class="card-badge-category"><i class="fas fa-calendar-alt"></i> ${dest.best_time}</span>
        </div>
        <div class="card-body">
          <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${dest.location}</div>
          <h3 class="card-title">${dest.name}</h3>
          <p class="card-description">${dest.short_desc}</p>
          <div class="card-footer">
            <div>
              <span class="card-price-label">Starts from</span>
              <div class="card-price-val">${formatCurrency(dest.approx_cost)}</div>
            </div>
            <a href="destination-details.html?id=${dest.id}" class="btn-custom btn-primary-gradient btn-sm-custom">
              Explore <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger" style="grid-column: 1/-1;">Unable to load destinations.</p>`;
  }
}

async function loadFeaturedPackages() {
  const container = document.getElementById('featured-packages-grid');
  if (!container) return;

  try {
    const res = await apiRequest('/api/packages?featured=true');
    const packages = res.data.slice(0, 4);

    if (packages.length === 0) {
      container.innerHTML = `<p class="text-center text-muted" style="grid-column: 1/-1;">No packages available yet.</p>`;
      return;
    }

    container.innerHTML = packages.map(pkg => {
      const services = pkg.included_services.split(',').slice(0, 3);
      return `
        <div class="package-card">
          <div class="card-img-wrapper">
            <img src="${pkg.image_url}" alt="${pkg.package_name}" loading="lazy">
            <span class="card-badge-top popular"><i class="fas fa-star"></i> Featured</span>
          </div>
          <div class="card-body">
            <div class="card-location"><i class="fas fa-compass"></i> ${pkg.destination_name}</div>
            <h3 class="card-title" style="font-size: 1.25rem;">${pkg.package_name}</h3>
            
            <div class="package-meta-row">
              <span class="package-meta-item"><i class="fas fa-sun"></i> ${pkg.duration_days} Days</span>
              <span class="package-meta-item"><i class="fas fa-moon"></i> ${pkg.duration_nights} Nights</span>
            </div>

            <div class="services-tags">
              ${services.map(s => `<span class="service-pill">${s.trim()}</span>`).join('')}
            </div>

            <div class="card-footer">
              <div>
                <span class="card-price-label">Per Person</span>
                <div class="card-price-val">${formatCurrency(pkg.price)}</div>
              </div>
              <a href="booking.html?package_id=${pkg.id}&destination_name=${encodeURIComponent(pkg.destination_name)}" class="btn-custom btn-accent-gradient btn-sm-custom">
                Book Now <i class="fas fa-bolt"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger" style="grid-column: 1/-1;">Unable to load tour packages.</p>`;
  }
}

async function loadCustomerReviews() {
  const container = document.getElementById('reviews-grid');
  if (!container) return;

  try {
    const res = await apiRequest('/api/reviews');
    const reviews = res.data.slice(0, 3);

    container.innerHTML = reviews.map(rev => {
      const stars = Array.from({ length: 5 }, (_, i) => 
        `<i class="${i < rev.rating ? 'fas fa-star' : 'far fa-star'}"></i>`
      ).join('');

      return `
        <div class="review-card">
          <div>
            <div class="stars-rating">${stars}</div>
            <p class="review-text">"${rev.comment}"</p>
          </div>
          <div class="reviewer-profile">
            <img src="${rev.user_avatar}" alt="${rev.user_name}" class="reviewer-avatar">
            <div>
              <div class="reviewer-name">${rev.user_name}</div>
              <div class="reviewer-location"><i class="fas fa-map-pin"></i> Explored ${rev.destination_name}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}
