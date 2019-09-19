"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relativePath = exports.isUrl = void 0;

var _url = require("url");

const isUrl = string => {
  const regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?/;
  return regexp.test(string);
};
/**
 * Get relative link in general
 *
 * @param {String} hrefAbsolute
 * @param {String} currentLink
 * @return {String}
 */


exports.isUrl = isUrl;

const relativePath = (hrefAbsolute, currentLink) => {
  try {
    return new _url.URL(hrefAbsolute, currentLink).href;
  } catch (error) {
    return null;
  }
};

exports.relativePath = relativePath;
//# sourceMappingURL=index.js.map