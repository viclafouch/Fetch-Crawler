# Fetch Crawler [![Build Status](https://travis-ci.com/viclafouch/Fetch-Crawler.svg?branch=master)](https://travis-ci.com/viclafouch/Fetch-Crawler)

###### [API](https://github.com/viclafouch/Fetch-Crawler/blob/master/docs/API.md) | [Examples](https://github.com/viclafouch/Fetch-Crawler/tree/master/examples) | [Changelog](https://github.com/viclafouch/Fetch-Crawler/blob/master/docs/CHANGELOG.md)

Distributed crawler powered by Fetch Crawler

## Features

Fetch Crawler is designed to provide a basic, flexible and robust API for crawling websites.

The crawler provides [simple APIs](#api-reference) to crawl these static websites with the following features:

* Distributed crawling
* Configure parallel, retry, max requests, time between request (to avoid spam) ...
* Support both [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) and [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) algorithm
* Stop at the max request
* Insert [Cheerio](https://cheerio.js.org/) automatically for scraping
* [Promise] support

## Getting Started

### Installation

```
# npm i @viclafouch/fetch-crawler
```

> **Note**: Fetch Crawler does not contain [Puppeteer](https://github.com/GoogleChrome/puppeteer). It using the [fetch-node](https://www.npmjs.com/package/node-fetch) module.

### Usage

```js
import FetchCrawler from '@viclafouch/fetch-crawler'

// I use Cheerio to get the content of the page
// See https://cheerio.js.org
const collectContent = $ =>
  $('body')
    .find('h1')
    .text()
    .trim()

// After getting content of the page, do what you want :)
// Accept async function
const doSomethingWith = (content, url) => console.log(`Here the title '${content}' from ${url}`)

// Here I start my crawler
// You can await for it if you want
FetchCrawler.launch({
  url: 'https://github.com',
  evaluatePage: $ => collectContent($),
  onSuccess: ({ result, url }) => doSomethingWith(result, url),
  onError: ({ error, url }) => console.log('Whouaa something wrong happened :('),
  maxRequest: 20
})
```

## FAQ

### How is this different from Puppeteer?

This crawler is built on top of [node-fetch](https://www.npmjs.com/package/node-fetch).

[Puppeteer](https://github.com/GoogleChrome/puppeteer) is a project from the Google Chrome team which enables us to control a Chrome (or any other Chrome DevTools Protocol based browser) and execute common actions, much like in a real browser. Fetch Crawler is a static crawler based on simple requests to HTML files. So it will be difficult to scrap the contents when the HTML dynamically changes on browsers.

## Node Support Policy

Fetch Crawler is currently supported by the Node Foundation.

Currently supported versions:

- 8.x
- 10.x
- 12.x

## Contributing

Any contributions and/or pull requests would be welcome.

## License

Copyright (c) 2019, Victor de la Fouchardiere.

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
