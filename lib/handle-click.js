const tabs = require('sdk/tabs');
const data = require('sdk/self').data;
const buildHatenaBookmarkEntryUrl = require('./build-hatena-bookmark-entry-url');

module.exports = () => {
  const worker = tabs.activeTab.attach({
    contentScriptFile: [
      data.url('../node_modules/browser-canonical-url/build/browser-canonical-url.js'),
      data.url('content-script.js'),
    ],
  });
  worker.port.on('canonicalUrl', (request) => {
    tabs.open(buildHatenaBookmarkEntryUrl(request));
  });
  worker.port.emit('getCanonicalUrl');
};
