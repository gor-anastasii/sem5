const http = require('http')
const port = 5000

const server = http.createServer((req, res) => {
    if(req.url == '/api/name' && req.method == 'GET'){
        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end('Gorodilina Anastasia Sergeevna')
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page not found");
    }
})

server.listen(port, () => console.log('Server has been started'))