import FetchCrawler from '../build'
import { URL } from 'url'
import fetch from 'node-fetch'
const assert = require('assert').strict

const baseWebsite = 'http://example.webscraping.com'

describe('Crawl externe', function() {
  it('Crawl get all flags informations', async function() {
    try {
      const response = await fetch(baseWebsite)
      if (response.status !== 200) throw new Error(response)
    } catch (error) {
      this.skip()
    }

    const countries = []

    const collectContent = $ => {
      try {
        return {
          name: $('#places_country__row')
            .children('.w2p_fw')
            .text()
            .trim()
        }
      } catch (error) {}
    }

    const isRequestValid = url => {
      const { pathname } = new URL(url)
      if (pathname.startsWith('/places/default/view/') || pathname.startsWith('/places/default/index/')) {
        return url
      } else {
        return false
      }
    }

    const doSomethingWith = (result, url) => {
      const { pathname } = new URL(url)
      if (pathname.startsWith('/places/default/view/')) countries.push(result)
    }

    await FetchCrawler.launch({
      url: baseWebsite,
      evaluatePage: $ => collectContent($),
      onSuccess: ({ result, url }) => doSomethingWith(result, url),
      preRequest: url => isRequestValid(url),
      maxDepth: 999,
      timeBetweenRequest: 1000,
      debugging: true,
      maxRequest: 10
    })

    assert.ok(countries.length > 5)
  })
})
