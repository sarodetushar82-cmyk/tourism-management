/**
 * Tourism Management System - API Client & Session Helpers
 */

const API_BASE_URL = window.location.origin;

// Token & User Management
const Auth = {
  getToken() {
    return localStorage.getItem('tms_token');
  },
  setToken(token) {
    localStorage.setItem('tms_token', token);
  },
  getUser() {
    const u = localStorage.getItem('tms_user');
    try {
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },
  setUser(user) {
    localStorage.setItem('tms_user', JSON.stringify(user));
  },
  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },
  logout() {
    localStorage.removeItem('tms_token');
    localStorage.removeItem('tms_user');
    window.location.href = 'login.html';
  }
};

// Generic API Request Helper
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requiresAuth || Auth.getToken()) {
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong with the server request.');
    }

    return result;
  } catch (error) {
    console.error(`API Error on [${method}] ${endpoint}:`, error);
    throw error;
  }
}

// Global Toast Alert Function
function showToast(message, type = 'info', title = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;

  let iconClass = 'fa-info-circle';
  let defaultTitle = 'Notification';
  if (type === 'success') {
    iconClass = 'fa-check-circle';
    defaultTitle = 'Success';
  } else if (type === 'error') {
    iconClass = 'fa-exclamation-circle';
    defaultTitle = 'Error';
  }

  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitle}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Indian Rupee Currency Formatter
function formatCurrency(num) {
  const val = parseFloat(num) || 0;
  return '₹' + val.toLocaleString('en-IN');
}

// Setup Shared Dynamic Header Navigation
function renderNavbar() {
  const navContainer = document.querySelector('.nav-actions');
  if (!navContainer) return;

  const user = Auth.getUser();

  if (user) {
    if (user.role === 'admin') {
      navContainer.innerHTML = `
        <a href="admin.html" class="btn-custom btn-primary-gradient btn-sm-custom">
          <i class="fas fa-shield-alt"></i> Admin Panel
        </a>
        <button onclick="Auth.logout()" class="btn-custom btn-outline-custom btn-sm-custom" title="Logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      `;
    } else {
      navContainer.innerHTML = `
        <a href="dashboard.html" class="btn-custom btn-primary-gradient btn-sm-custom">
          <i class="fas fa-user-circle"></i> Dashboard
        </a>
        <button onclick="Auth.logout()" class="btn-custom btn-outline-custom btn-sm-custom" title="Logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      `;
    }
  } else {
    navContainer.innerHTML = `
      <a href="login.html" class="btn-custom btn-outline-custom btn-sm-custom">
        <i class="fas fa-sign-in-alt"></i> Login
      </a>
      <a href="register.html" class="btn-custom btn-primary-gradient btn-sm-custom">
        <i class="fas fa-user-plus"></i> Register
      </a>
    `;
  }

  // Mobile menu toggle
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// Auto run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});
