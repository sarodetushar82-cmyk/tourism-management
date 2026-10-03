/**
 * Booking Page Logic
 */

let allDestinations = [];
let allPackages = [];
let selectedUnitCost = 0;

document.addEventListener('DOMContentLoaded', async () => {
  // Set minimum date to today
  const dateInput = document.getElementById('travel-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Pre-fill user data if logged in
  const user = Auth.getUser();
  if (user) {
    if (document.getElementById('user-name')) document.getElementById('user-name').value = user.name || '';
    if (document.getElementById('user-email')) document.getElementById('user-email').value = user.email || '';
    if (document.getElementById('user-phone')) document.getElementById('user-phone').value = user.phone || '';
  }

  await loadOptions();

  // Watch inputs for live price calculation
  const travelersInput = document.getElementById('travelers-count');
  if (travelersInput) {
    travelersInput.addEventListener('input', updatePricing);
  }

  const destSelect = document.getElementById('booking-destination');
  if (destSelect) {
    destSelect.addEventListener('change', () => {
      onDestinationChange();
      updatePricing();
    });
  }

  const pkgSelect = document.getElementById('booking-package');
  if (pkgSelect) {
    pkgSelect.addEventListener('change', () => {
      onPackageChange();
      updatePricing();
    });
  }

  // Booking Form Submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
});

async function loadOptions() {
  try {
    const [destRes, pkgRes] = await Promise.all([
      apiRequest('/api/destinations'),
      apiRequest('/api/packages')
    ]);

    allDestinations = destRes.data;
    allPackages = pkgRes.data;

    const destSelect = document.getElementById('booking-destination');
    const pkgSelect = document.getElementById('booking-package');

    if (destSelect) {
      destSelect.innerHTML = '<option value="">-- Choose a Destination --</option>';
      allDestinations.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.dataset.name = d.name;
        opt.dataset.cost = d.approx_cost;
        opt.textContent = `${d.name} (${formatCurrency(d.approx_cost)})`;
        destSelect.appendChild(opt);
      });
    }

    if (pkgSelect) {
      pkgSelect.innerHTML = '<option value="">-- Choose a Tour Package --</option>';
      allPackages.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.dataset.dest = p.destination_name;
        opt.dataset.destId = p.destination_id;
        opt.dataset.price = p.price;
        opt.dataset.name = p.package_name;
        opt.textContent = `${p.package_name} - ${formatCurrency(p.price)}`;
        pkgSelect.appendChild(opt);
      });
    }

    // Check query params for initial selection
    const urlParams = new URLSearchParams(window.location.search);
    const initialPkgId = urlParams.get('package_id');
    const initialDestId = urlParams.get('destination_id');
    const initialDestName = urlParams.get('destination_name');

    if (initialPkgId && pkgSelect) {
      pkgSelect.value = initialPkgId;
      onPackageChange();
    } else if (initialDestId && destSelect) {
      destSelect.value = initialDestId;
      onDestinationChange();
    } else if (initialDestName && destSelect) {
      const match = allDestinations.find(d => d.name.toLowerCase() === initialDestName.toLowerCase());
      if (match) {
        destSelect.value = match.id;
        onDestinationChange();
      }
    }

    updatePricing();
  } catch (error) {
    showToast('Failed to load destination and package data.', 'error');
  }
}

function onDestinationChange() {
  const destSelect = document.getElementById('booking-destination');
  const pkgSelect = document.getElementById('booking-package');
  const selectedDestId = parseInt(destSelect.value, 10);

  if (!selectedDestId) {
    // Reset package options to all
    populatePackagesDropdown(allPackages);
    return;
  }

  const selectedDest = allDestinations.find(d => d.id === selectedDestId);
  if (!selectedDest) return;

  const relevantPackages = allPackages.filter(p => 
    p.destination_id === selectedDestId ||
    (p.destination_name && p.destination_name.toLowerCase() === selectedDest.name.toLowerCase())
  );

  populatePackagesDropdown(relevantPackages.length > 0 ? relevantPackages : allPackages);
}

function onPackageChange() {
  const pkgSelect = document.getElementById('booking-package');
  const destSelect = document.getElementById('booking-destination');
  const selectedPkgId = parseInt(pkgSelect.value, 10);

  if (!selectedPkgId) return;

  const selectedPkg = allPackages.find(p => p.id === selectedPkgId);
  if (selectedPkg && selectedPkg.destination_id && destSelect) {
    destSelect.value = selectedPkg.destination_id;
  }
}

function populatePackagesDropdown(packagesList) {
  const pkgSelect = document.getElementById('booking-package');
  const currentVal = pkgSelect.value;

  pkgSelect.innerHTML = '<option value="">-- Choose a Tour Package --</option>';
  packagesList.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.dataset.dest = p.destination_name;
    opt.dataset.destId = p.destination_id;
    opt.dataset.price = p.price;
    opt.dataset.name = p.package_name;
    opt.textContent = `${p.package_name} - ${formatCurrency(p.price)}`;
    pkgSelect.appendChild(opt);
  });

  if (currentVal && packagesList.some(p => p.id == currentVal)) {
    pkgSelect.value = currentVal;
  }
}

function updatePricing() {
  const pkgSelect = document.getElementById('booking-package');
  const destSelect = document.getElementById('booking-destination');
  const travelersInput = document.getElementById('travelers-count');

  let travelers = parseInt(travelersInput ? travelersInput.value : 1, 10);
  if (isNaN(travelers) || travelers < 1) travelers = 1;

  let unitPrice = 0;
  let packageName = 'Custom Tour';

  const selectedPkgId = pkgSelect ? parseInt(pkgSelect.value, 10) : null;
  if (selectedPkgId) {
    const pkg = allPackages.find(p => p.id === selectedPkgId);
    if (pkg) {
      unitPrice = parseFloat(pkg.price);
      packageName = pkg.package_name;
    }
  }

  if (unitPrice === 0) {
    const selectedDestId = destSelect ? parseInt(destSelect.value, 10) : null;
    if (selectedDestId) {
      const dest = allDestinations.find(d => d.id === selectedDestId);
      if (dest) unitPrice = parseFloat(dest.approx_cost);
    }
  }

  selectedUnitCost = unitPrice;
  const totalPrice = unitPrice * travelers;

  if (document.getElementById('summary-package-name')) {
    document.getElementById('summary-package-name').textContent = packageName;
  }
  if (document.getElementById('summary-unit-price')) {
    document.getElementById('summary-unit-price').textContent = formatCurrency(unitPrice);
  }
  if (document.getElementById('summary-travelers')) {
    document.getElementById('summary-travelers').textContent = travelers;
  }
  if (document.getElementById('summary-total-price')) {
    document.getElementById('summary-total-price').textContent = formatCurrency(totalPrice);
  }
}

async function handleBookingSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const phone = document.getElementById('user-phone').value.trim();
  const travelDate = document.getElementById('travel-date').value;
  const destSelect = document.getElementById('booking-destination');
  const pkgSelect = document.getElementById('booking-package');
  const travelersCount = parseInt(document.getElementById('travelers-count').value, 10);
  const requests = document.getElementById('special-requests').value.trim();

  if (!name || !email || !phone || !travelDate) {
    showToast('Please fill out all required personal and travel information.', 'error');
    return;
  }

  if (!destSelect.value && !pkgSelect.value) {
    showToast('Please select at least a Destination or a Tour Package.', 'error');
    return;
  }

  let destName = '';
  if (destSelect.selectedIndex > 0) {
    destName = destSelect.options[destSelect.selectedIndex].dataset.name || destSelect.options[destSelect.selectedIndex].text.split('(')[0].trim();
  }

  let pkgName = '';
  if (pkgSelect.selectedIndex > 0) {
    pkgName = pkgSelect.options[pkgSelect.selectedIndex].dataset.name || pkgSelect.options[pkgSelect.selectedIndex].text.split('-')[0].trim();
  } else {
    pkgName = `${destName} Custom Vacation Package`;
  }

  const payload = {
    destination_id: destSelect.value ? parseInt(destSelect.value, 10) : null,
    package_id: pkgSelect.value ? parseInt(pkgSelect.value, 10) : null,
    destination_name: destName || 'India Explorer',
    package_name: pkgName,
    user_name: name,
    email: email,
    phone: phone,
    travel_date: travelDate,
    travelers_count: travelersCount || 1,
    special_requests: requests
  };

  const submitBtn = document.getElementById('submit-booking-btn');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Booking...';

  try {
    const res = await apiRequest('/api/bookings', 'POST', payload);

    // Show Confirmation Modal
    const modal = document.getElementById('booking-success-modal');
    if (modal) {
      document.getElementById('conf-ref-number').textContent = res.booking.booking_ref;
      document.getElementById('conf-pkg-name').textContent = res.booking.package_name;
      document.getElementById('conf-date').textContent = res.booking.travel_date;
      document.getElementById('conf-travelers').textContent = res.booking.travelers_count;
      document.getElementById('conf-price').textContent = formatCurrency(res.booking.total_price);
      modal.classList.add('active');
    } else {
      showToast('Booking submitted successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }
  } catch (error) {
    showToast(error.message || 'Failed to place booking.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}
