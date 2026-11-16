/**
 * Serenity Hotel — Login / Auth (demo, no backend)
 */
(function () {
  'use strict';

  var loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    if (!password) {
      alert('Please enter your password.');
      return;
    }
    var name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    localStorage.setItem('serenity_user', JSON.stringify({ name: name, email: email }));
    window.location.href = 'index.html';
  });
})();
