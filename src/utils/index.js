import { URL } from 'url'

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */
export const isUrl = string => {
  const regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?/
  return regexp.test(string)
}

/**
 * Get relative link in general
 *
 * @param {String} hrefAbsolute
 * @param {String} currentLink
 * @return {String}
 */
export const relativePath = (hrefAbsolute, currentLink) => {
  try {
    return new URL(hrefAbsolute, currentLink).href
  } catch (error) {
    return null
  }
}
