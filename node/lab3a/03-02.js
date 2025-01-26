const http = require('http')
const url = require('url')

const port = 5000

const factorial = (n) => {
    return n === 0 ? 1 : n * factorial(n - 1)
}

const server = http.createServer((req, res) => {
    if(req.url.startsWith('/fact') && req.method === 'GET'){
        const params = url.parse(req.url, true).query
        const k = +params.k
        
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