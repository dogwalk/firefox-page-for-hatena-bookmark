const isNumber = require('lodash.isnumber');
const { expireThreshold } = require('./constants');

/**
  * Get cached counts
  *
  * @param bookmarks {Object} stored bookmarks
  * @param url {string} target url
  * @param expireDuration {number}
  * @param referenceTime {Date}
  * @returns {?number} counts
  */
module.exports = (bookmarks, url, expireDuration = expireThreshold, referenceTime = Date.now()) => {
  if (!bookmarks ||
    !url ||
    !bookmarks[url] ||
    !bookmarks[url].updatedAt ||
    bookmarks[url].updatedAt + expireDuration < referenceTime ||
    !isNumber(bookmarks[url].count)
  ) {
    return null;
  }
  return bookmarks[url].count;
};
