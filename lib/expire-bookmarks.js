const isNumber = require('lodash.isnumber');
const { expireThreshold } = require('./constants');

/**
  * Expire bookmarks
  *
  * This method has side effect!!!
  *
  * @param bookmarks {Object} bookmarks
  * @param expireDuration {number} expire duration (millisecond)
  * @param referenceTime {number} Date.now()
  */
module.exports = (bookmarks, expireDuration = expireThreshold, referenceTime = Date.now()) => {
  if (!bookmarks) { return; }
  for (let key of Object.keys(bookmarks)) {// eslint-disable-line prefer-const
    const value = bookmarks[key];
    if (value.updatedAt &&
      isNumber(value.count) &&
      value.updatedAt + expireDuration > referenceTime
    ) {
      continue;
    }
    delete bookmarks[key];// eslint-disable-line no-param-reassign
  }
};
