# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.12] - 2017-08-26

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




