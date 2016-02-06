'use strict';
/**
  * Hatena Bookmark Json Lite Url
  *
  * @param {string} originalUrl
  * @returns {string} hatena bookmark Json Lite url
  * @see http://b.hatena.ne.jp/help/entry/api
  */
module.exports = (originalUrl) =>
  `http://b.hatena.ne.jp/entry/jsonlite/${originalUrl.replace(/#/g, '%23')}`;
