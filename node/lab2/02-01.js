const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 5000

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')

    if(req.url == '/html' && req.method == 'GET'){
        const indexPage = path.join(__dirname, 'index.html')
        fs.readFile(indexPage, (err, content) => {
            if(err){
                res.statusCode = 500
                res.end('<h2>Error file</h2>')
            } else {
                res.statusCode = 200
                res.end(content)
            }

        })
    } else {
        res.statusCode = 404
        res.end('<h2>Page not found</h2>')
    }
})

server.listen(port, () => console.log('Server has been started!'))