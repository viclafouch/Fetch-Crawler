import FetchCrawler from '../build'
import { app, baseUrl } from '../build-test/server'
const assert = require('assert').strict

describe('Crawl local', function() {
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

  it('Basic get anchors', async function() {
    const { linksVisited } = await FetchCrawler.launch({
      url: baseUrl + '/anchors'
    })
    assert.equal(3, linksVisited)
  })

  it('Basic 404', async function() {
    this.timeout(5000 * 3 + 1000)
    const { linksVisited } = await FetchCrawler.launch({
      url: baseUrl + '/not-found',
      retryTimeout: 5000,
      retryCount: 2
    })
    assert.equal(linksVisited, 1)
  })
})
