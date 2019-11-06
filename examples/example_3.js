const fs = require('fs')
const FetchCrawler = require('@viclafouch/fetch-crawler')

const urlToCrawl = new URL('https://support.google.com/youtube')
const languages = ['en', 'fr']

// Get ID of the url
// https://support.google.com/youtube/answer/7072797 => 7072797
const getUuid = url => {
  try {
    const { pathname } = new URL(url)
    const uuid = pathname.slice(pathname.lastIndexOf('/') + 1)
    return parseInt(uuid, 10)
  } catch (error) {
    return null
  }
}

// Get title / description of the page
const collectContent = $ => ({
  'meta-title': ($('title').text() || '').trim(),
  'meta-description': $('meta[name=description]').attr('content') || ''
})

// Only url including some string
// https://support.google.com/youtube/answer/7072797 => ok
// https://support.google.com/chrome/283/id/ => !ok
export const isRequestValid = ({ url, lang }) => {
  const { pathname } = new URL(url)
  if (!url.startsWith(urlToCrawl.origin + urlToCrawl.pathname)) return false
  if (pathname.includes('/answer') || pathname.includes('/topic')) {
    url = new URL(url)
    url.hash = ''
    url.search = ''
    url.searchParams.set('hl', lang)
    return url.toString() // Avoid n params GET, hash, etc..., just 'hl' param is usefull
  }

  return false
}

// Do something ONLY if an url has a pathname including /answer/UUID
// Clean the url and save meta-title, meta-description, and url
const doSomethingWith = (content, url, resultByLang) => {
  const uuid = getUuid(url)
  const link = new URL(url)
  if (isNaN(uuid) || !link.pathname.includes('/answer/')) return
  link.pathname = urlToCrawl.pathname + `/answer/${uuid}`
  resultByLang.push({
    ...content,
    href: link.toString()
  })
}

// Await for n crawlers (1 by lang)
// Save all results in a JSON file
;(async () => {
  const json = {}
  for (const lang of languages) {
    const resultByLang = []
    urlToCrawl.searchParams.set('hl', lang)
    await FetchCrawler.launch({
      url: urlToCrawl.toString(),
      evaluatePage: $ => collectContent($),
      onSuccess: ({ result, url }) => doSomethingWith(result, url, resultByLang),
      preRequest: url => isRequestValid({ url, lang }),
      maxDepth: 6,
      parallel: 5,
      maxRequest: 100,
      debugging: true
    })
    json[lang] = resultByLang
  }

  const result = JSON.stringify(json, null, 2)

  try {
    await new Promise((resolve, reject) =>
      fs.writeFile('examples/example_3.json', result, err => {
        if (err) reject(err)
        else resolve()
      })
    )
  } catch (error) {
    console.error(error)
  }
})()
