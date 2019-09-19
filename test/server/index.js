const express = require('express')
const path = require('path')
const port = 3000

const app = express()

module.exports.app = app
module.exports.baseUrl = `http://localhost:${port}`

const dirPages = path.join(__dirname, 'pages')

app.get('/', function(req, res) {
  res.sendFile(path.join(dirPages, 'index.html'))
})

app.get('/imgs', function(req, res) {
  res.sendFile(path.join(dirPages, 'imgs.html'))
})

app.get('/anchors', function(req, res) {
  res.sendFile(path.join(dirPages, 'anchors.html'))
})

app.get('/not-found', function(req, res) {
  res.status(404)
})
