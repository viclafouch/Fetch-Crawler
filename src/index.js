import { retryRequest, isUrl } from './utils'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

class Crawler {
  constructor(options = {}) {
    this._options = Object.assign(
      {},
      {
        maxRequest: -1,
        skipStrictDuplicates: true,
        sameOrigin: true,
        maxDepth: 3,
        parallel: 5,
        debugging: false
      },
      options
    )
    this.hostdomain = ''
    this.linksToCrawl = new Map()
    this.linksCrawled = new Map()
    this._actions = {
      preRequest: this._options.preRequest || (x => x),
      onSuccess: this._options.onSuccess || null,
      evaluatePage: this._options.evaluatePage || null,
      onRedirection: this._options.onRedirection || (({ previousUrl }) => previousUrl)
    }
  }

  /**
   * Init the app.
   * Begin with the first link, and start the pulling
   * @return {!Promise<pending>}
   */
  async init() {
    try {
      if (!isUrl(this._options.url)) throw new Error()
      const link = new URL(this._options.url)
      this.hostdomain = link.origin
      if (!this.hostdomain) throw new Error()
    } catch (error) {
      throw new Error('URL provided is not valid')
    }

    const sanitizedUrl = await this.shouldRequest(this._options.url)
    if (!sanitizedUrl) return

    this.linksCrawled.set(sanitizedUrl)

    await this.pull(sanitizedUrl, 1)
    if (this.linksToCrawl.size > 0) await this.crawl()
  }

  /**
   * Get all links from the page.
   * @param {!Cheerio} $
   * @param {!String} actualHref
   * @return {!Promise<Array<string>}
   */
  collectAnchors($, actualHref) {
    let linksCollected = []
    try {
      const { origin, protocol } = new URL(actualHref)
      linksCollected = $('a')
        .map((i, e) => {
          const href = $(e).attr('href') || ''
          if (href.startsWith('//')) return protocol + href
          else if (href.startsWith('/')) return origin + href
          else return href
        }) // Cheerio map method
        .filter((i, href) => isUrl(href)) // Cheerio filter method
        .get() // Cheerio get method to transform as an array
    } catch (error) {
      console.error(`Something wrong happened with this url: ${actualHref}`)
      console.error(error)
    }

    return [...new Set(linksCollected)] // Avoid duplication
  }

  /**
   * Check if link can be crawled (Same origin ? Already collected ? preRequest !false ?).
   * @param {!String} link
   * @return {!Promise<Boolean>}
   */
  async skipRequest(link) {
    const allowOrigin = this.checkSameOrigin(link)
    if (!allowOrigin) return true
    if (this._options.skipStrictDuplicates && this.linkAlreadyCollected(link)) return true
    const shouldRequest = await this.shouldRequest(link)
    return !shouldRequest
  }

  /**
   * If preRequest is provided by the user, get new link or false.
   * @param {!String} link
   * @return {!Promise<String || Boolean>}
   */
  async shouldRequest(link) {
    if (this._actions.preRequest instanceof Function) {
      try {
        const preRequest = await this._actions.preRequest(link)
        if (typeof preRequest === 'string' || preRequest === false) return preRequest
        throw new Error('preRequest function must return a String or False')
      } catch (error) {
        console.error('Please try/catch your preRequest function')
        console.error(error.message)
      }
    }
    return link
  }

  /**
   * Check if link has the same origin as the host link.
   * @param {!String} url
   * @return {!Boolean}
   */
  checkSameOrigin(url) {
    if (this._options.sameOrigin) return new URL(url).origin === this.hostdomain
    return true
  }

  /**
   * If evaluatePage is provided by the user, await for it.
   * @param {!Cheerio} $
   * @return {!Promise<any>}
   */
  async evaluate($) {
    let result = null
    if (this._actions.evaluatePage && this._actions.evaluatePage instanceof Function) {
      result = await this._actions.evaluatePage($)
    }
    return result
  }

  /**
   * Add links collected to queue.
   * @param {!Array<string>} urlCollected
   * @param {!Number} depth
   * @return {!Promise<pending>}
   */
  async addToQueue(urlCollected, depth = 0) {
    for (const url of urlCollected) {
      if (depth <= this._options.maxDepth) {
        if (await this.skipRequest(url)) {
          this._options.debugging && console.info(`\x1b[33m Ignoring ${url} \x1b[m`)
        } else {
          const linkEdited = await this.shouldRequest(url)
          this.linksToCrawl.set(linkEdited, depth)
        }
      }
    }
  }

  /**
   * Crawl links from 'linksToCrawl' and wait for having 'canceled' to true.
   * @return {!Promise<pending>}
   */
  crawl() {
    return new Promise((resolve, reject) => {
      let canceled = false
      let currentCrawlers = 0
      const pullQueue = () => {
        if (canceled) return
        while (currentCrawlers < this._options.parallel && this.linksToCrawl.size > 0) {
          canceled = !this.checkMaxRequest()
          if (canceled) {
            currentCrawlers === 0 && resolve()
            break
          }
          currentCrawlers++
          const currentLink = this.linksToCrawl.keys().next().value
          const currentDepth = this.linksToCrawl.get(currentLink)
          this.linksToCrawl.delete(currentLink)
          this.linksCrawled.set(currentLink)
          this.pull(currentLink, currentDepth)
            .then(() => {
              currentCrawlers--
              if (currentCrawlers === 0 && (this.linksToCrawl.size === 0 || canceled)) resolve()
              else pullQueue()
            })
            .catch(error => {
              canceled = true
              reject(error)
            })
        }
      }
      pullQueue()
    })
  }

  /**
   * Pull result and links from a page and add them to the queue.
   * @param {!String} link
   * @param {!Number} depth
   * @return {!Promise<pending>}
   */
  async pull(link, depth) {
    try {
      this._options.debugging && console.info(`\x1b[1;32m [${this.linksCrawled.size}] Crawling ${link}...\x1b[m`)
      const { result, linksCollected, url, isError } = await this.scrapePage(link)
      if (!isError) await this.scrapeSucceed({ urlScraped: url, result })
      await this.addToQueue(linksCollected, depth + 1)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Know if a link will be crawled or has already been crawled.
   * @param {!String} url
   * @return {!Boolean}
   */
  linkAlreadyCollected(url) {
    return this.linksCrawled.has(url) || this.linksToCrawl.has(url)
  }

  /**
   * Know if we have exceeded the number of request max provided in the options.
   * @return {!Boolean}
   */
  checkMaxRequest() {
    if (this._options.maxRequest === -1) return true
    return this.linksCrawled.size < this._options.maxRequest
  }

  /**
   * If onSuccess action's has been provided, await for it.
   * @param {!Object<{urlScraped: string, result: any}>}
   * @return {!Promise<pending>}
   */
  async scrapeSucceed({ urlScraped, result }) {
    if (this._actions.onSuccess && this._actions.onSuccess instanceof Function) {
      try {
        await this._actions.onSuccess({ result, url: urlScraped })
      } catch (error) {
        console.error('Please try/catch your onSuccess function')
      }
    }
  }

  /**
   * Scrap a page, evaluate and get new links to visit.
   * @param {!String} url
   * @return {!Promise<{linksCollected: array, result: any, url: string}>}
   */
  async scrapePage(url) {
    const retriedFetch = retryRequest(fetch, 2)
    try {
      const response = await retriedFetch(url)
      if (response.redirected) {
        url = await this._options.onRedirection({ previousUrl: url, response })
        if (!url) throw new Error()
      }
      const textResponse = await response.text()
      const $ = cheerio.load(textResponse)
      const [result, linksCollected] = await Promise.all([this.evaluate($), this.collectAnchors($, url)])
      return { linksCollected, result, url }
    } catch (error) {
      return {
        linksCollected: [],
        result: null,
        url,
        isError: true
      }
    }
  }

  /**
   * Starting the crawl.
   * @param {!0bject} options
   * @return {!Promise<{startCrawlingAt: Date, finishCrawlingAt: Date, linksVisited: Number}>}
   */
  static async launch(options) {
    const startCrawlingAt = new Date()
    const crawler = new Crawler(options)
    await crawler.init()
    const finishCrawlingAt = new Date()
    return { startCrawlingAt, finishCrawlingAt, linksVisited: crawler.linksCrawled.size }
  }
}

module.exports = Crawler
