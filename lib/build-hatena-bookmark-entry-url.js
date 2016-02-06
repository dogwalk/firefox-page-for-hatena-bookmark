'use strict';
/**
  * Hatena Bookmark Entry Url
  *
  * @param {string} originalUrl
  * @returns {string} hatena bookmark entry url
  * @see http://b.hatena.ne.jp/help/entry/api
  */
module.exports = (originalUrl) =>
  `http://b.hatena.ne.jp/entry/${originalUrl.replace(/#/g, '%23')}`;
