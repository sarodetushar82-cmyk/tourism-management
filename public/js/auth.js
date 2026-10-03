/**
 * Authentication Logic (Login & Registration)
 */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect
  const user = Auth.getUser();
  if (user) {
    if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) {
      if (user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Registration Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Admin Tab Switcher (in login.html)
  const tabUser = document.getElementById('tab-user');
  const tabAdmin = document.getElementById('tab-admin');
  const roleInput = document.getElementById('login-role');

  if (tabUser && tabAdmin && roleInput) {
    tabUser.addEventListener('click', () => {
      tabUser.classList.add('active');
      tabAdmin.classList.remove('active');
      roleInput.value = 'user';
      document.getElementById('login-heading').textContent = 'User Sign In';
    });

    tabAdmin.addEventListener('click', () => {
      tabAdmin.classList.add('active');
      tabUser.classList.remove('active');
      roleInput.value = 'admin';
      document.getElementById('login-heading').textContent = 'Administrator Portal';
    });
  }

  // Quick fill demo credentials buttons
  const fillUserDemo = document.getElementById('fill-user-demo');
  const fillAdminDemo = document.getElementById('fill-admin-demo');

  if (fillUserDemo) {
    fillUserDemo.addEventListener('click', () => {
      if (tabUser) tabUser.click();
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('password').value = 'user123';
    });
  }

  if (fillAdminDemo) {
    fillAdminDemo.addEventListener('click', () => {
      if (tabAdmin) tabAdmin.click();
      document.getElementById('email').value = 'admin@tourism.com';
      document.getElementById('password').value = 'admin123';
    });
  }
});

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('login-role') ? document.getElementById('login-role').value : 'user';

  if (!email || !password) {
    showToast('Please enter both email and password.', 'error');
    return;
  }

  const endpoint = role === 'admin' ? '/api/auth/admin-login' : '/api/auth/login';
  const submitBtn = document.getElementById('login-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

  try {
    const res = await apiRequest(endpoint, 'POST', { email, password });
    Auth.setToken(res.token);
    Auth.setUser(res.user);

    showToast('Login successful! Redirecting...', 'success');

    setTimeout(() => {
      if (res.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 1000);
  } catch (error) {
    showToast(error.message || 'Invalid credentials.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Sign In <i class="fas fa-arrow-right"></i>';
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  if (!name || !email || !phone || !password || !confirmPassword) {
    showToast('Please fill out all registration fields.', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must contain at least 6 characters.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Password and confirmation do not match.', 'error');
    return;
  }

  const submitBtn = document.getElementById('register-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

  try {
    const res = await apiRequest('/api/auth/register', 'POST', {
      name,
      email,
      phone,
      password,
      confirmPassword
    });

    Auth.setToken(res.token);
    Auth.setUser(res.user);

    showToast('Registration complete! Welcome to our tourism family.', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
  } catch (error) {
    showToast(error.message || 'Failed to register account.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
  }
}
