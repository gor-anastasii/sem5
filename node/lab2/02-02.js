const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 5000

const server = http.createServer((req, res) => {
    if(req.url == "/png" && req.method == "GET"){
        const imagePage = path.join(__dirname, 'pic.png')
        fs.readFile(imagePage, (err, content) => {
            if(err){
                res.end('Error file')
            } else {
                res.setHeader('Content-Type', 'image/png');
                res.end(content);
            }
        })
    } else {
        res.end('Page not found')
    }
})

server.listen(port, () => console.log('Server has been started!'))