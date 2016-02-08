'use strict';

const isFirefoxAndroid = require('is-firefox-android')();
const handleClick = require('./lib/handle-click');
const { PageMod } = require('sdk/page-mod');
const tabs = require('sdk/tabs');
const { data } = require('sdk/self');
const getWindow = require('get-firefox-browser-window');
const { EventTarget } = require('sdk/event/target');
const { Request } = require('sdk/request');
const { emit } = require('sdk/event/core');
const simpleStorage = require('sdk/simple-storage');
const storage = simpleStorage.storage;
const isNumber = require('lodash.isnumber');
const buildHatenaBookmarkJsonLiteUrl = require('./lib/build-hatena-bookmark-json-lite-url');
const expireBookmarks = require('./lib/expire-bookmarks');
const target = EventTarget();// eslint-disable-line new-cap
let button;
let menuId;
let page;
let currentUrl;
const { expireThreshold } = require('./lib/constants');

/**
  * storage.bookmarks
  * { url -> { updatedAt: time, count: number }}
  */
if (!storage.bookmarks) {
  storage.bookmarks = {};
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
    if (isNumber(piece) && piece > 9999) {
      button.badge = 9999;
    } else {
      button.badge = piece;
    }
  }
});


expireBookmarks(storage.bookmarks);
simpleStorage.on('OverQuota', () => {
  expireBookmarks(storage.bookmarks);
});

function cachedCount(bookmarks, url) {
  if (!bookmarks ||
      !url ||
      !bookmarks[url] ||
      !bookmarks[url].updatedAt ||
      bookmarks[url].updatedAt + expireThreshold < Date.now() ||
      !isNumber(bookmarks[url].count)
  ) {
    return null;
  }
  return bookmarks[url].count;
}

target.on('pingUrl', (url) => {
  if (!url) { return; }
  if (!(/^http/.test(url))) {
    emit(target, 'updateBadge', url, '-');
    return;
  }
  const cached = cachedCount(storage.bookmarks, url);
  if (isNumber(cached)) {
    emit(target, 'updateBadge', url, cached);
  } else {
    emit(target, 'updateBadge', url, '-');

    const req = Request({// eslint-disable-line new-cap
      url: buildHatenaBookmarkJsonLiteUrl(url),
    });
    req.on('complete', (response) => {
      if (response.status !== 200 || !response.json) { return; }
      const count = Number(response.json.count);
      if (!storage.bookmarks) {
        storage.bookmarks = {};
      }
      storage.bookmarks[url] = {
        count,
        updatedAt: Date.now(),
      };
      emit(target, 'updateBadge', url, count);
    });
    req.get();
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
    emit(target, 'pingUrl', request);
  });
  worker.port.emit('getCanonicalUrl');
});
