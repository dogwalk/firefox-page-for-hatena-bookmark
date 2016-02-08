const isNumber = require('lodash.isnumber');
const { expireThreshold } = require('./constants');

/**
  * Get cached counts
  *
  * @param bookmarks {Object} stored bookmarks
  * @param url {string} target url
  * @returns {?number} counts
  */
module.exports = (bookmarks, url) => {
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
};
