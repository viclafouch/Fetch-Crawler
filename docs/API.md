# API reference

## Usage

```javascript
/* @return Promise<{
    startCrawlingAt: Date,
    finishCrawlingAt: Date,
    linksVisited: Number
  }>
*/
FetchCrawler.launch({
  // ...
})
```

### Custom instance configuration

All configurations are optional except one : the `url` parameter.

| Name | Type | Default | Description |
| ---  | ---  | ---     | ---         |
| url  | String  | `null` | Define the website to crawl. |
| maxRequest  | Number  | `-1` | Maximum number of requests. Pass `-1` to disable the limit. |
| skipStrictDuplicates  | Boolean  | `true` | Whether to skip duplicate requests. The request is considered to be the same if url is strictly the same. |
| maxDepth  | Number  | `3` | Maximum depth for the crawler to follow links automatically. |
| sameOrigin  | Boolean  | `true` | Define if the link has to be skipped if its origin is not the same as the `url` parameter defined. |
| parallel  | Number  | `5` | Maximum number of link to crawl concurrently. |
| debugging  | Boolean  | `false` | Active logs during crawling. |
| retryCount  | Number  | `2` | Number of retry when request fails. |
| retryTimeout  | Number  | `5000` | Limit of time in milliseconds for a request. |
| timeBetweenRequest  | Number  | `0` | For some reason, you maybe want to add a delay in milliseconds between each request. If this option is provided, `parallel` option's is set to `1`. |


### Methods

| Function | Parameters | Return | Description |
| ---      | ---        | ---    | ---     |
| preRequest | url: `String` | `String` or `false` | Function to modify url before each request. You can also return `false` if you want to skip the request. __The first url is not concerned!__. |
| evaluatePage | $: `Cheerio Object` | `any` | Function for traversing/manipulating the content of the page. [Cheerio](https://cheerio.js.org/) is provided to parses markup and it provides a robust API to do that. |
| onSuccess | `Object` `{` result: `any`, url: `String` `}` |  |Function to be called when `evaluatePage()` successes. |
| onError | `Object` `{` error: `Error`, url: `String` `}` |  |Function to be called when request failed. |
| onRedirection | `Object` `{` previousUrl: `String`, response: `Response` `}`  | `String` or `false` | Detect if the response has [redirected](https://developer.mozilla.org/fr/docs/Web/API/Response/redirected) as `true`. Do the same as the `preRequest` function. You can return `false` if you want to skip the request. |

```javascript
FetchCrawler.launch({
  // (required)
  // Url of the website to crawl.
  url: 'https://foo.com',

  // (optional)
  // Default : -1
  // Maximum number of requests. Pass -1 to disable the limit.
  maxRequest: 150,

  // (optional)
  // Default : true
  // Whether to skip duplicate requests. The request is considered to be the same if url is strictly the same.
  skipStrictDuplicates: true,

  // (optional)
  // Default : 3
  // Maximum depth for the crawler to follow links automatically.
  maxDepth: 6,

  // (optional)
  // Default : true
  // Define if the link has to be skipped if its origin is not the same as the `url` parameter defined.
  sameOrigin: true,

  // (optional)
  // Default : 5
  // Maximum number of link to crawl concurrently.
  parallel: 10,

  // (optional)
  // Default : false
  // Active logs during crawling.
  debugging: true,

  // (optional)
  // Default : 2
  // Number of retry when request fails.
  retryCount: 5,

  // (optional)
  // Default : 5000
  // Limit of time in milliseconds for a request.
  retryTimeout: 3000,

  // (optional)
  // Default : 0
  // For some reason, you maybe want to add a delay in   milliseconds between each request. If this option is provided, `parallel` option's is set to `1`.
  timeBetweenRequest: 3000,

  // (optional)
  // Default : (url => url)
  // Function to modify url before each request. You can also return `false` if you want to skip the request.
  preRequest: url => {
    if (url.includes('/bar/foo/')) return url
    return false
  },

  // (optional)
  // Default : ($ => null)
  // Function for traversing/manipulating the content of the page. Cheerio is provided to parses markup and it provides a robust API to do that.
  // Doc Cheerio : https://cheerio.js.org/
  evaluatePage: $ => {
    return {
      title: $('body').find('h1').text(),
      meta: $('meta[name=description]').attr('content')
    }
  },

  // (optional)
  // Default : null
  // Function to be called when `evaluatePage()` successes.
  onSuccess: ({ result, url }) => {
    // Add to database ?
    // Add to a json file ?
    // Add to an excel file ?
    console.log(`Here the title : ${result.title}`)
    console.log(`Here the meta description : ${result.meta}`)
    console.log(`Here the url crawled : ${url}`)
  },

  // (optional)
  // Default : null
  // Function to be called when request failed.
  onError: ({ error, url }) => {
    // remove from database ?
    // remove from a json file ?
    // remove from an excel file ?
    console.log(`Here the error : ${error.message}`)
  },

  // (optional)
  // Default : (({ previousUrl }) => previousUrl)
  // If the URL has a 301 redirection, do the same as the `preRequest` function. You can return `false` if you want to skip the request.
  onRedirection: ({ previousUrl, response }) => {
    if (response.url.includes('/bar/foo/')) return url
    return false
  }
})
```