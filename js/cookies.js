// js/cookies.js

function generateId() {
  return 'gp_' + Math.random().toString(36).substr(2, 16) +
         Math.random().toString(36).substr(2, 16);
}

function getCookieId() {
  const match = document.cookie.match(/gp_user=([^;]+)/);
  return match ? match[1] : null;
}

function setCookieId(id) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + CONFIG.cookieDurationYears);
  document.cookie = `gp_user=${id}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function refreshCookie() {
  const id = getCookieId() || generateId();
  setCookieId(id);
  return id;
}
