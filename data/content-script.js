/* global browserCanonicalUrl:false */
// browser-canonical-url https://www.npmjs.com/package/browser-canonical-url
const canonicalUrl = browserCanonicalUrl() || location.href;
self.port.on('getCanonicalUrl', () => {
  self.port.emit('canonicalUrl', canonicalUrl);
});
