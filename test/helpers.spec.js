import { isUrl, relativePath } from '../build/utils'
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

  it('relativePath', function() {
    const urlA = relativePath('/test', 'https://www.website.com')
    assert.equal('https://www.website.com/test', urlA)

    const urlB = relativePath('//test.com?param=1', 'https://www.website.com')
    assert.equal('https://test.com/?param=1', urlB)

    const urlC = relativePath('./test/hello', 'https://www.website.com/param1')
    assert.equal('https://www.website.com/test/hello', urlC)

    const urlD = relativePath('https://www.website.com', 'https://www.website.com')
    assert.equal('https://www.website.com/', urlD)

    const urlE = relativePath('path', 'notValidUrl')
    assert.equal(null, urlE)
  })
})
