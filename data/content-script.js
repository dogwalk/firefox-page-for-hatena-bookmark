/**
 * @license
 * http://upa-pc.blogspot.jp/2015/03/javascript-canonical-url-get.html
 * Copyright © 2012-2015 Dr.ウーパ
 *
 * @return {?string} canonical url.
 */
function browserCanonicalUrl() {
  'use strict';
  const links = document.getElementsByTagName('link');
  const linksLength = links.length;
  for (let i = 0; i < linksLength; i++) {
    if (links[i].rel && links[i].rel.toLowerCase() === 'canonical') {
      return links[i].href;
    }
  }
  return null;
}
const canonicalUrl = browserCanonicalUrl() || location.href;
self.port.emit('canonicalUrl', canonicalUrl);
self.port.on('getCanonicalUrl', () => {
  self.port.emit('canonicalUrl', canonicalUrl);
});
