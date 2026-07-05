// js/utils.js
function generateSlug(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array.forEach(n => slug += chars[n % chars.length]);
  return slug;
}
function poemUrl(slug) {
  return `poem.html?id=${slug}&t=${Date.now()}`;
}
