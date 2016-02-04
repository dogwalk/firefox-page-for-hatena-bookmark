'use strict';

const isFirefoxAndroid = require('is-firefox-android')();
const handleClick = require('./lib/handle-click');
const { PageMod } = require('sdk/page-mod');
const data = require('sdk/self').data;

PageMod({// eslint-disable-line new-cap
  include: '*',
  contentScriptFile: data.url('content-script.js'),
  attachTo: ['existing', 'top'],
  onAttach: (worker) => {
    worker.port.on('canonicalUrl', (request) => {
      console.log(request);// eslint-disable-line no-console
    });
  },
});

if (isFirefoxAndroid) {
  const getWindow = require('get-firefox-browser-window');
  let menuId = 0;
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
  ActionButton({// eslint-disable-line new-cap
    id: 'page-for-hatena-bookmark',
    label: 'Page for Hatebu',
    icon: {
      16: './bookmark42-16.png',
      32: './bookmark42-32.png',
      64: './bookmark42-64.png',
    },
    onClick: handleClick,
  });
}
