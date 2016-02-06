'use strict';

const isFirefoxAndroid = require('is-firefox-android')();
const handleClick = require('./lib/handle-click');
const { PageMod } = require('sdk/page-mod');
const tabs = require('sdk/tabs');
const data = require('sdk/self').data;
const getWindow = require('get-firefox-browser-window');
let button;
let menuId;
let page;
let currentUrl;

if (isFirefoxAndroid) {
  menuId = 0;
  exports.main = (options, callback) => {// eslint-disable-line no-unused-vars
    menuId = getWindow().NativeWindow.menu.add({
      name: 'Page for Hatebu (-)',
      callback: handleClick,
    });
  };
  exports.onUnload = (reason) => {// eslint-disable-line no-unused-vars
    getWindow().NativeWindow.menu.remove(menuId);
  };
} else {
  const { ActionButton } = require('sdk/ui/button/action');
  button = ActionButton({// eslint-disable-line new-cap
    id: 'page-for-hatena-bookmark',
    label: 'Page for Hatebu',
    icon: {
      16: './bookmark42-16.png',
      32: './bookmark42-32.png',
      64: './bookmark42-64.png',
    },
    onClick: handleClick,
    badge: '',
    badgeColor: '#696969',
  });
}

page = PageMod({// eslint-disable-line new-cap
  include: '*',
  contentScriptFile: [
    data.url('../node_modules/browser-canonical-url/build/browser-canonical-url.js'),
    data.url('content-script.js'),
  ],
  attachTo: ['existing', 'top'],
});

page.on('attach', (worker) => {
  worker.port.on('canonicalUrl', (request) => {
    if (isFirefoxAndroid) {// eslint-disable-line no-empty
    } else {
      button.badge = 1;
    }
    console.log(`page-loaded: ${request}`);// eslint-disable-line no-console
  });
  worker.port.emit('getCanonicalUrl');
});

tabs.on('activate', (tab) => {
  const worker = tab.attach({
    contentScriptFile: [
      data.url('../node_modules/browser-canonical-url/build/browser-canonical-url.js'),
      data.url('content-script.js'),
    ],
  });
  worker.port.on('canonicalUrl', (request) => {
    currentUrl = request;
    console.log(currentUrl);// eslint-disable-line no-console
    const count = Math.floor(Math.random() * 50);
    if (isFirefoxAndroid) {
      getWindow().NativeWindow.menu.update(menuId, { name: `Page for Hatebu (${count})`})
    } else {
      button.badge = count;
    }
  });
  worker.port.emit('getCanonicalUrl');
});
