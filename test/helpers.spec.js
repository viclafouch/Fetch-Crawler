import fetch from 'node-fetch'
import { isUrl, retryRequest } from '../build/utils'
const assert = require('assert').strict

describe('Helpers', function() {
  it('isUrl', function() {
    const urlA = isUrl('https://stackoverflow.com')
    assert.ok(urlA)
    const urlB = isUrl('/accounts/?hl=en')
    assert.ok(!urlB)
    const urlC = isUrl('ftp://user:password@website.ext')
    assert.ok(urlC)
    const urlD = isUrl('http://support.google.com/')
    assert.ok(urlD)
    const urlE = isUrl('//www.youtube.com/')
    assert.ok(!urlE)
    const urlF = isUrl('www.amazon.fr')
    assert.ok(!urlF)
    const urlG = isUrl('victor-de-la-fouchardiere.fr')
    assert.ok(!urlG)
    const urlH = isUrl(true)
    assert.ok(!urlH)
    const urlI = isUrl('')
    assert.ok(!urlI)
    const urlJ = isUrl()
    assert.ok(!urlJ)
  })

  it('retryRequest', async function() {
    const response = await retryRequest(fetch, 2)('https://stackoverflow.com')
    assert.equal(response.status, 200)
  })
})
