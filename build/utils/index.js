"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUrl = void 0;

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */
const isUrl = string => {
  const regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?/;
  return regexp.test(string);
};

exports.isUrl = isUrl;
//# sourceMappingURL=index.js.map