/**
 * Fatemeh Mokarrami — Medical Scholar & Clinical Researcher
 * Core Client-Side Logic: Navigation, Telegram Ordering, Search & Modal Systems
 * Zero-Build / Pure Vanilla JS for GitHub Pages & Local Drag-and-Drop
 */

(function () {
  'use strict';

  // Highlight active link according to current window.location.pathname
  function setupActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('[data-nav-link]');

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute('href');
      const isCurrent =
        linkPath === currentPath ||
        (currentPath === '' && linkPath === 'index.html') ||
        (currentPath === 'index.html' && linkPath === './') ||
        (currentPath === 'index.html' && linkPath === 'index.html');

      if (isCurrent) {
        link.classList.add('text-secondary', 'font-semibold', 'bg-secondary-fixed/40');
        link.classList.remove('text-on-surface-variant');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('text-secondary', 'font-semibold', 'bg-secondary-fixed/40');
        link.classList.add('text-on-surface-variant');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Mobile Menu Drawer
  function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('mobileMenuClose');
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');

    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.remove('translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.add('translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.querySelectorAll('#mobileNavDrawer a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-[#006860] text-white' : 'bg-[#2b5cad] text-white';
    const icon = type === 'success' ? 'check_circle' : 'info';

    toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${bgColor} text-sm font-medium transition-all duration-300 transform translate-y-3 opacity-0 pointer-events-auto`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px]">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Telegram Ordering & Direct Academic Inquiries
  function setupTelegramOrdering() {
    const orderModal = document.getElementById('telegramOrderModal');
    const orderButtons = document.querySelectorAll('[data-telegram-order]');
    const closeBtn = document.getElementById('closeOrderModalBtn');
    const orderForm = document.getElementById('telegramOrderForm');
    const itemSelect = document.getElementById('orderItemSelect');

    if (!orderModal) return;

    function openModal(preselectedItem = '') {
      orderModal.classList.remove('hidden');
      if (itemSelect && preselectedItem) {
        itemSelect.value = preselectedItem;
      }
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      orderModal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    orderButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemName = btn.getAttribute('data-telegram-order') || '';
        openModal(itemName);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeModal();
    });

    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = document.getElementById('orderItemSelect')?.value || 'General Inquiry';
        const name = document.getElementById('orderNameInput')?.value || 'Guest';
        const affiliation = document.getElementById('orderAffiliationInput')?.value || 'Not specified';
        const quantity = document.getElementById('orderQuantityInput')?.value || '1 copy';
        const notes = document.getElementById('orderNotesInput')?.value || '';

        const telegramText =
          `🏥 *Academic Order / Clinical Inquiry*\n\n` +
          `• *Item / Topic:* ${item}\n` +
          `• *Inquirer Name:* ${name}\n` +
          `• *Affiliation:* ${affiliation}\n` +
          `• *Quantity/Format:* ${quantity}\n` +
          (notes ? `• *Notes:* ${notes}\n` : '') +
          `\nSent via Fatemeh Mokarrami Academic Portal.`;

        const encodedText = encodeURIComponent(telegramText);
        // Telegram link
        const telegramUrl = `https://t.me/fatemehmokarrami?text=${encodedText}`;

        closeModal();
        showToast('Connecting to Telegram order chat...', 'info');

        // Open Telegram
        window.open(telegramUrl, '_blank', 'noopener,noreferrer');
      });
    }
  }

  // Copy Citation Helper
  window.copyCitation = function (bibtexText, message = 'Citation copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(bibtexText).then(() => {
        showToast(message, 'success');
      }).catch(() => {
        showToast('Citation copied!', 'success');
      });
    } else {
      showToast(message, 'success');
    }
  };

  // Expose global helper
  window.openTelegramOrder = function (itemName = '') {
    const orderModal = document.getElementById('telegramOrderModal');
    const itemSelect = document.getElementById('orderItemSelect');
    if (orderModal) {
      orderModal.classList.remove('hidden');
      if (itemSelect && itemName) itemSelect.value = itemName;
      document.body.style.overflow = 'hidden';
    } else {
      const encoded = encodeURIComponent(`Inquiry regarding: ${itemName}`);
      window.open(`https://t.me/fatemehmokarrami?text=${encoded}`, '_blank');
    }
  };

  // Document Ready Initialization
  document.addEventListener('DOMContentLoaded', () => {
    setupActiveNav();
    setupMobileMenu();
    setupTelegramOrdering();
  });
})();
