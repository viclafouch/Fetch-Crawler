const fs = require('fs')
const FetchCrawler = require('@viclafouch/fetch-crawler')

const urlToCrawl = 'https://101apparel.com/collections/premium-t-shirt-series?page=1'
let products = []

// I'm getting an array of each product of the page (name, price, images)
const collectContent = $ => {
  const content = []
  $('.product-index').each(function(i, elem) {
    content.push({
      name: $(this)
        .find($('.product-info-inner a'))
        .text()
        .replace(/(\r\n|\n|\r)/gm, '')
        .trim(),
      price: parseInt(
        $(this)
          .find($('.product-info-inner .price'))
          .text()
          .replace(/(\r\n|\n|\r|[^\d.-])/gm, '')
          .trim()
      ),
      images: $(this)
        .find($('img'))
        .map((i, el) => $(el).attr('src'))
        .get()
        .filter(src => src.includes('/products/'))
    })
  })
  return content
}

// Only url including an exact string
const checkUrl = url => (url.includes('premium-t-shirt-series?page=') ? url : false)

// Concat my new products to my array
const doSomethingWith = (content, url) => (products = products.concat(content))

// Await for the crawler, and then save result in a JSON file
;(async () => {
  try {
    await FetchCrawler.launch({
      url: urlToCrawl,
      evaluatePage: $ => collectContent($),
      onSuccess: ({ result, url }) => doSomethingWith(result, url),
      preRequest: url => checkUrl(url),
      maxDepth: 4,
      parallel: 6
    })
    const jsonResult = JSON.stringify(products, null, 2)
    await fs.promises.writeFile('examples/example_2.json', jsonResult)
  } catch (error) {
    console.error(error)
  }
})()
