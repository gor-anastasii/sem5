const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const port = 5000

const factorial = (n) => {
    return n === 0 ? 1 : n * factorial(n - 1)
}

const server = http.createServer((req, res) => {
    if(req.url === "/" && req.method === "GET"){
        const pagePath = path.join(__dirname, '03-03.html')
        fs.readFile(pagePath, (err, content) => {
            if(err){
                res.statusCode = 500
                res.end('Error reading file')
            } else {
                res.setHeader('Content-Type', 'text/html')
                res.end(content)
            }
        })
    } else if(req.url.startsWith('/fact') && req.method === 'GET'){
        const parsedUrl = url.parse(req.url, true).query
        const k = +parsedUrl.k

        if(!isNaN(k)){
            const fact = factorial(k)
            const response = JSON.stringify({ k: k, fact: fact })

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(response)
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" })
            res.end("Invalid parameter")
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" })
        res.end("Page not found")
    }
})

server.listen(port, () => {
    console.log('Сервер запущен успешно!')
})