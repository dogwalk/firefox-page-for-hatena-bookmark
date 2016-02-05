const tabs = require('sdk/tabs');
const data = require('sdk/self').data;

module.exports = () => {
  const worker = tabs.activeTab.attach({
    contentScriptFile: data.url('content-script.js'),
  });
  worker.port.on('canonicalUrl', (request) => {
    console.log(`clicked: ${request}`);// eslint-disable-line no-console
  });
  worker.port.emit('getCanonicalUrl');
};
