/**
 * Serenity Hotel — Room Booking & Bill Generation
 */

(function () {
  'use strict';

  const form = document.getElementById('booking-form');
  const billSection = document.getElementById('bill-section');
  const roomTypeSelect = document.getElementById('room-type');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  // Login state: show welcome + logout when logged in, else show login link
  function updateAuthUI() {
    var userEl = document.getElementById('user-welcome');
    var loginEl = document.getElementById('nav-login');
    var logoutEl = document.getElementById('nav-logout');
    if (!userEl || !loginEl || !logoutEl) return;
    try {
      var data = localStorage.getItem('serenity_user');
      var user = data ? JSON.parse(data) : null;
      if (user && user.name) {
        userEl.textContent = 'Hi, ' + user.name;
        userEl.classList.remove('hidden');
        loginEl.classList.add('hidden');
        logoutEl.classList.remove('hidden');
        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        if (nameInput) nameInput.value = user.name;
        if (emailInput) emailInput.value = user.email || '';
      } else {
        userEl.classList.add('hidden');
        loginEl.classList.remove('hidden');
        logoutEl.classList.add('hidden');
      }
    } catch (e) {}
  }

  updateAuthUI();

  document.getElementById('nav-logout').addEventListener('click', function () {
    localStorage.removeItem('serenity_user');
    document.getElementById('user-welcome').classList.add('hidden');
    document.getElementById('nav-login').classList.remove('hidden');
    this.classList.add('hidden');
  });

  // Set minimum date to today for check-in
  function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;
  }

  // When check-in changes, set check-out min to check-in
  function onCheckinChange() {
    const checkin = checkinInput.value;
    if (checkin) {
      checkoutInput.min = checkin;
      if (checkoutInput.value && checkoutInput.value < checkin) {
        checkoutInput.value = '';
      }
    }
  }

  if (checkinInput) checkinInput.addEventListener('change', onCheckinChange);
  setMinDates();

  // Book room buttons — prefill form and scroll to booking
  document.querySelectorAll('.book-room-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const room = this.getAttribute('data-room');
      const price = this.getAttribute('data-price');
      const select = document.getElementById('room-type');
      if (select) {
        const options = select.querySelectorAll('option');
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === room) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Generate unique booking ID
  function generateBookingId() {
    const prefix = 'SH';
    const num = Math.floor(100000 + Math.random() * 900000);
    return prefix + num;
  }

  // Calculate nights between two dates
  function getNights(checkin, checkout) {
    const a = new Date(checkin);
    const b = new Date(checkout);
    const diff = b.getTime() - a.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  }

  // Format date for display
  function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Show bill and fill in data
  function showBill(data) {
    const nights = getNights(data.checkin, data.checkout);
    const roomTotal = nights * data.pricePerNight;
    const taxRate = 0.1;
    const tax = roomTotal * taxRate;
    const total = roomTotal + tax;

    document.getElementById('bill-id').textContent = data.bookingId;
    document.getElementById('bill-name').textContent = data.name;
    document.getElementById('bill-email').textContent = data.email;
    document.getElementById('bill-phone').textContent = data.phone;
    document.getElementById('bill-room').textContent = data.roomType;
    document.getElementById('bill-checkin').textContent = formatDate(data.checkin);
    document.getElementById('bill-checkout').textContent = formatDate(data.checkout);
    document.getElementById('bill-nights').textContent = nights;
    document.getElementById('bill-guests').textContent = data.guests;
    document.getElementById('bill-room-total').textContent = '$' + roomTotal.toFixed(2);
    document.getElementById('bill-tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('bill-total').textContent = '$' + total.toFixed(2);
    document.getElementById('bill-date').textContent = 'Generated on ' + formatDate(new Date());

    billSection.classList.remove('hidden');
    billSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    const pricePerNight = parseInt(selectedOption.getAttribute('data-price') || '0', 10);

    const data = {
      bookingId: generateBookingId(),
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      roomType: roomTypeSelect.value,
      checkin: document.getElementById('checkin').value,
      checkout: document.getElementById('checkout').value,
      guests: document.getElementById('guests').value,
      pricePerNight: pricePerNight
    };

    if (!data.roomType || !data.checkin || !data.checkout) {
      alert('Please fill in room type, check-in and check-out dates.');
      return;
    }

    const nights = getNights(data.checkin, data.checkout);
    if (nights < 1) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    showBill(data);
  });

  // Print bill
  document.getElementById('print-bill').addEventListener('click', function () {
    window.print();
  });

  // New booking — hide bill and scroll to form
  document.getElementById('new-booking').addEventListener('click', function () {
    billSection.classList.add('hidden');
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
  });

  // Mobile nav toggle (optional)
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }
})();
