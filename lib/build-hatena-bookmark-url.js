'use strict';
/**
  * Hatena Bookmark Url
  *
  * @param {string} originalUrl
  * @returns {string} hatena bookmark url
  * @see http://b.hatena.ne.jp/help/entry/api
  */
module.exports = (originalUrl) =>
  `http://b.hatena.ne.jp/entry/${originalUrl.replace(/#/g, '%23')}`;
