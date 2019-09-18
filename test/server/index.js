const express = require('express')
const path = require('path')
const port = 3000

export const app = express()
export const baseUrl = `http://localhost:${port}`

const dirPages = path.join(__dirname, 'pages')

app.get('/', function(req, res) {
  res.sendFile(path.join(dirPages, 'index.html'))
})

app.get('/imgs', function(req, res) {
  res.sendFile(path.join(dirPages, 'imgs.html'))
})

app.get('/not-found', function(req, res) {
  res.status(404)
})
