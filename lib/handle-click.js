const tabs = require('sdk/tabs');

module.exports = () => {
  const worker = tabs.activeTab.attach({});
  worker.port.on('canonicalUrl', (request) => {
    console.log(request);// eslint-disable-line no-console
  });
  worker.port.emit('getCanonicalUrl');
};
