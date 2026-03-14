// ===== CPSS Shared JavaScript Utilities =====

// Session Management
function isLoggedIn() {
  return localStorage.getItem('cpss-user') !== null;
}

function getUser() {
  const userData = localStorage.getItem('cpss-user');
  return userData ? JSON.parse(userData) : null;
}

function logout() {
  localStorage.removeItem('cpss-user');
  localStorage.removeItem('cpss-admin-auth');
  localStorage.removeItem('cpss-admin-email');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

// Render Navbar with login state
function renderNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const loggedIn = isLoggedIn();
  const user = getUser();

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="/" class="navbar-logo">
          <div class="navbar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div class="navbar-logo-text-group">
            <span class="navbar-logo-main">CPSS</span>
            <span class="navbar-logo-sub">Civic Service</span>
          </div>
        </a>

        <div class="navbar-nav">
          <a href="/" class="navbar-link">
            <i data-lucide="home" class="icon-sm"></i>
            Home
          </a>
          <a href="/complaint" class="navbar-link">
            <i data-lucide="file-text" class="icon-sm"></i>
            Submit
          </a>
          <a href="/complaints" class="navbar-link">
            <i data-lucide="list" class="icon-sm"></i>
            Browse
          </a>
          <a href="/track" class="navbar-link">
            <i data-lucide="search" class="icon-sm"></i>
            Track
          </a>
          <a href="/services" class="navbar-link">
            <i data-lucide="building" class="icon-sm"></i>
            Services
          </a>
          <a href="/contact" class="navbar-link">
            <i data-lucide="phone" class="icon-sm"></i>
            Contact
          </a>
          <a href="/ai-chatbot" class="navbar-link">
            <i data-lucide="bot" class="icon-sm"></i>
            AI Chat
          </a>
        </div>

        <div class="navbar-actions">
          <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
            <i data-lucide="moon" class="icon theme-toggle-icon"></i>
          </button>

          ${loggedIn ? `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="text-sm text-muted-foreground hidden sm:block">
                Welcome, ${user?.user?.user_metadata?.first_name || user?.user?.email?.split('@')[0] || 'User'}!
              </span>
              <button onclick="logout()" class="btn btn-outline btn-sm">
                <i data-lucide="log-out" class="icon-sm"></i>
                <span class="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ` : `
            <a href="/login" class="btn btn-primary btn-sm">
              <i data-lucide="log-in" class="icon-sm"></i>
              Sign In
            </a>
          `}

          <button class="mobile-menu-btn" aria-label="Open menu">
            <i data-lucide="menu" class="icon"></i>
          </button>
        </div>
      </div>
    </nav>

    <div class="mobile-overlay"></div>
    <div class="mobile-menu">
      <div class="mobile-menu-header">
        <span class="font-semibold">Menu</span>
        <button class="mobile-menu-close" aria-label="Close menu">
          <i data-lucide="x" class="icon"></i>
        </button>
      </div>
      <div class="mobile-menu-links">
        <a href="/" class="mobile-menu-link">
          <i data-lucide="home" class="icon-sm"></i>
          Home
        </a>
        <a href="/complaint" class="mobile-menu-link">
          <i data-lucide="file-text" class="icon-sm"></i>
          Submit Complaint
        </a>
        <a href="/complaints" class="mobile-menu-link">
          <i data-lucide="list" class="icon-sm"></i>
          Browse Complaints
        </a>
        <a href="/track" class="mobile-menu-link">
          <i data-lucide="search" class="icon-sm"></i>
          Track Status
        </a>
        <a href="/services" class="mobile-menu-link">
          <i data-lucide="building" class="icon-sm"></i>
          Services
        </a>
        <a href="/contact" class="mobile-menu-link">
          <i data-lucide="phone" class="icon-sm"></i>
          Contact
        </a>
        <a href="/ai-chatbot" class="mobile-menu-link">
          <i data-lucide="bot" class="icon-sm"></i>
          AI Assistant
        </a>

        ${loggedIn ? `
          <div class="mobile-menu-link" style="border-top: 1px solid var(--border); margin-top: 1rem; padding-top: 1rem;">
            <div style="margin-bottom: 0.5rem;">
              <span class="text-sm text-muted-foreground">
                Signed in as ${user?.user?.user_metadata?.first_name || user?.user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button onclick="logout()" class="btn btn-outline" style="width: 100%;">
              <i data-lucide="log-out" class="icon-sm"></i>
              Sign Out
            </button>
          </div>
        ` : `
          <a href="/login" class="mobile-menu-link" style="border-top: 1px solid var(--border); margin-top: 1rem; padding-top: 1rem;">
            <i data-lucide="log-in" class="icon-sm"></i>
            Sign In
          </a>
        `}
      </div>
    </div>
  `;
}

// Render Footer
function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-section">
          <h4>About CPSS</h4>
          <ul>
            <li><a href="/">About Us</a></li>
            <li><a href="/">Our Mission</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Terms of Service</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a href="/services">Waste Management</a></li>
            <li><a href="/services">Transportation</a></li>
            <li><a href="/services">Water & Sewage</a></li>
            <li><a href="/services">Parks & Recreation</a></li>
            <li><a href="/services">Street Lighting</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/complaint">Submit Complaint</a></li>
            <li><a href="/track">Track Status</a></li>
            <li><a href="/contact">Contact Authorities</a></li>
            <li><a href="/ai-chatbot">AI Assistant</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
            <li><a href="mailto:info@cpss.gov">info@cpss.gov</a></li>
            <li>123 Civic Center Plaza</li>
            <li>City Hall, 12345</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Civic Public Service System. All rights reserved. | Built with dedication to serve our community.</p>
      </div>
    </footer>
  `;
}

// Protected route helper
function requireAuth(redirectTo = '/login') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Redirect if already logged in
function redirectIfLoggedIn(redirectTo = '/') {
  if (isLoggedIn()) {
    window.location.href = redirectTo;
    return true;
  }
  return false;
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('cpss-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  return savedTheme;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('cpss-theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme');
  const themeIcon = document.querySelector('.theme-toggle-icon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    lucide.createIcons();
  }
}

// Mobile menu
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const overlay = document.querySelector('.mobile-overlay');
  const menu = document.querySelector('.mobile-menu');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu on link click
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  const overlay = document.querySelector('.mobile-overlay');
  const menu = document.querySelector('.mobile-menu');
  if (menu) menu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Set active nav link
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-link, .mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      (path === '/' && href === '/') ||
      (path !== '/' && href !== '/' && path.startsWith(href))
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Toast notifications
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.backgroundColor = type === 'error' ? 'var(--destructive)' : 'var(--accent)';
  toast.style.color = 'white';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Initialize Lucide icons
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  initTheme();
  updateThemeIcon();
  initMobileMenu();
  setActiveNavLink();
  initIcons();
});