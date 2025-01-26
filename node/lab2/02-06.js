const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 5000

const server = http.createServer((req, res) => {
    if (req.url === '/jquery') {
        fs.readFile(path.join(__dirname, 'jquery.html'), (err, content) => {
        if (err) {
            res.statusCode = 500
            res.end('Error file')
        } else {
            res.setHeader('Content-Type', 'text/html')
            res.end(content)
        }
        })
    } else if (req.url === '/api/name') {
        res.setHeader('Content-Type', 'text/plain')
        res.end('Gorodilina Anastasia Sergeevna')
    } else {
        res.statusCode = 404
        res.end('Page not found')
    }
})

server.listen(port, () => console.log('Server has been started!'))