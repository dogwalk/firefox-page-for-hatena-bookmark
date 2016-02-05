const tabs = require('sdk/tabs');
const data = require('sdk/self').data;
const buildHatenaBookmarkUrl = require('./build-hatena-bookmark-url');

module.exports = () => {
  const worker = tabs.activeTab.attach({
    contentScriptFile: data.url('content-script.js'),
  });
  worker.port.on('canonicalUrl', (request) => {
    tabs.open(buildHatenaBookmarkUrl(request));
  });
  worker.port.emit('getCanonicalUrl');
};
