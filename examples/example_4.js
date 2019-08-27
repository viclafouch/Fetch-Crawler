import FetchCrawler from '@viclafouch/fetch-crawler'
import fs from 'fs'

// Get all games on xbox platform
const urlToCrawl = 'https://www.instant-gaming.com/en/search/?type%5B0%5D=xbox'
let games = []

// I'm getting an array of each game on the page (name, price, cover, discount)
const collectContent = $ => {
  const content = []
  $('.item.mainshadow').each(function(i, elem) {
    content.push({
      name: $(this)
        .find($('.name'))
        .text()
        .trim(),
      price: $(this)
        .find($('.price'))
        .text()
        .trim(),
      discount: $(this)
        .find($('.discount'))
        .text()
        .trim(),
      cover: $(this)
        .find($('.picture'))
        .attr('src')
    })
  })
  return content
}

// Only url including an exact string
const checkUrl = url => {
  try {
    const link = new URL(url)
    if (url === urlToCrawl || (link.searchParams.get('type[0]') === 'xbox' && link.searchParams.get('page'))) {
      return url
    }
    return false
  } catch (error) {
    return false
  }
}

// Concat my new games to my array
const doSomethingWith = content => (games = games.concat(content))

// Await for the crawler, and then save result in a JSON file
;(async () => {
  await FetchCrawler.launch({
    url: urlToCrawl,
    evaluatePage: $ => collectContent($),
    onSuccess: ({ result, url }) => doSomethingWith(result, url),
    preRequest: url => checkUrl(url),
    maxDepth: 4,
    parallel: 6
  })

  const jsonResult = JSON.stringify({ ...games }, null, 2)

  try {
    await new Promise((resolve, reject) =>
      fs.writeFile('examples/example_4.json', jsonResult, err => {
        if (err) reject(err)
        else resolve()
      })
    )
  } catch (error) {
    console.error(error)
  }
})()
