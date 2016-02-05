const canonicalUrl = browserCanonicalUrl() || location.href;
self.port.on('getCanonicalUrl', () => {
  self.port.emit('canonicalUrl', canonicalUrl);
});
