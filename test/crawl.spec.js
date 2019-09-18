import FetchCrawler from '../build'
import { app, baseUrl } from '../build-test/server'
const assert = require('assert').strict

describe('Crawl', function() {
  let server = null
  before(async function() {
    server = await app.listen(3000)
  })

  after(async function() {
    await server.close()
  })

  it('Basic Hello World', async function() {
    let title = null
    await FetchCrawler.launch({
      url: baseUrl + '/',
      evaluatePage: $ =>
        $('body')
          .find('h1')
          .text()
          .trim(),
      onSuccess: ({ result }) => (title = result)
    })
    assert.equal(title, 'Hello World')
  })

  it('Basic get img', async function() {
    let imgsLength = 0
    await FetchCrawler.launch({
      url: baseUrl + '/imgs',
      evaluatePage: $ => $('#list-img').find($('li')).length,
      onSuccess: ({ result }) => (imgsLength = result)
    })
    assert.equal(imgsLength, 6)
  })

  it('Basic 404', async function() {
    const { linksVisited } = await Promise.race([
      FetchCrawler.launch({
        url: baseUrl + '/not-found',
        retryTimeout: 5000,
        retryCount: 2
      }),
      new Promise((resolve, reject) => setTimeout(reject, 3 * 5000 + 1000))
    ])
    assert.equal(linksVisited, 1)
  })
})
