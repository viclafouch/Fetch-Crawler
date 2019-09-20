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
      onSuccess: ({ result }) => (title = result),
      onError: ({ error }) => {
        console.log('erreur Hello world', error)
      }
    })
    assert.equal(title, 'Hello World')
  })

  it('Basic get img', async function() {
    let imgsLength = 0
    await FetchCrawler.launch({
      url: baseUrl + '/imgs',
      evaluatePage: $ => $('#list-img').find($('li')).length,
      onSuccess: ({ result }) => (imgsLength = result),
      onError: ({ error }) => {
        console.log('erreur basic img', error)
      }
    })
    assert.equal(imgsLength, 6)
  })

  it('Basic get anchors', async function() {
    const { linksVisited } = await FetchCrawler.launch({
      url: baseUrl + '/anchors'
    })
    assert.equal(3, linksVisited)
  })

  it('Basic 404 timeout', async function() {
    this.timeout(2000)
    let flag = false
    let err = null
    await FetchCrawler.launch({
      url: baseUrl + '/not-found',
      retryTimeout: 1000,
      retryCount: 0,
      onError: ({ error }) => {
        flag = true
        err = error
      }
    })
    assert.ok(flag)
    assert.equal(err.type, 'aborted')
  })
})
