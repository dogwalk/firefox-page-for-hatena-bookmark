'use strict';

const isFirefoxAndroid = require('is-firefox-android')();
const handleClick = require('./lib/handle-click');
const { PageMod } = require('sdk/page-mod');
const tabs = require('sdk/tabs');
const data = require('sdk/self').data;
const getWindow = require('get-firefox-browser-window');
const { EventTarget } = require('sdk/event/target');
const { emit } = require('sdk/event/core');
const simpleStorage = require('sdk/simple-storage');
const isNumber = require('lodash.isnumber');
const target = EventTarget();// eslint-disable-line new-cap
let button;
let menuId;
let page;
let currentUrl;// eslint-disable-line no-unused-vars

/**
  * bookmarks
  * { url -> { updatedAt: time, count: number }}
  */
if (!simpleStorage.storage.bookmarks) {
  simpleStorage.storage.bookmarks = {};
}

target.on('updateBadge', (url, piece) => {
  if (url !== currentUrl) { return; }
  if (isFirefoxAndroid) {
    getWindow().NativeWindow.menu.update(
      menuId,
      {
        name: `Page for Hatebu (${piece})`,
      });
  } else {
    button.badge = piece;
  }
});

target.on('pingUrl', (url) => {
  if (!url) { return; }
  if (simpleStorage.storage.bookmarks &&
    simpleStorage.storage.bookmarks[url] &&
    isNumber(simpleStorage.storage.bookmarks[url].count)) {
    emit(target, 'updateBadge', url, simpleStorage.storage.bookmarks[url].count);
  } else {
    const count = Math.floor(Math.random() * 50);
    emit(target, 'updateBadge', url, count);
  }
});

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
    badge: '-',
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
    currentUrl = request;
    console.log(`page-loaded: ${request}`);// eslint-disable-line no-console
    emit(target, 'pingUrl', request);
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
    console.log(`activated: ${request}`);// eslint-disable-line no-console
    emit(target, 'pingUrl', request);
  });
  worker.port.emit('getCanonicalUrl');
});
