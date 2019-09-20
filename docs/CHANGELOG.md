# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.13] - 2019-09-20

* Add 3 options :
  - `retryCount` (Number of retry when request fails. Default: `2`).
  - `retryTimeout` (Limit of time in milliseconds for a request. Default: `5000`).
  - `timeBetweenRequest` (For some reason, you maybe want to add a delay in milliseconds between each request. If this option is provided, `parallel` option's is set to `1`. Default: `0`).

* Add `onError` action's that takes one parameter: `Object{ error: Error, url: String}`.
* Before each request, the hash of an url is removed.
* The first url provided by the user ignores now the `preRequest` function.

## [1.0.12] - 2019-08-26

### Added
* Implement first version of the crawler with some bug fixed (since 1.0.0).
* Insert [Cheerio](https://cheerio.js.org/) automatically for scraping.
* Use [Node-Fetch](https://www.npmjs.com/package/node-fetch).
* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) support.
* Some options:
  - `maxRequest`
  - `sameOrigin`
  - `maxDepth`
  - `parallel`
  - `debugging`
  - `skipStrictDuplicates`
* Some methods:
  - `preRequest`
  - `onSuccess`
  - `onRedirection`
  - `evaluatePage`
* Docs:
  - [Examples](https://github.com/viclafouch/Fetch-Crawler/tree/master/examples)
  - [API](https://github.com/viclafouch/Fetch-Crawler/blob/master/docs/API.md)




