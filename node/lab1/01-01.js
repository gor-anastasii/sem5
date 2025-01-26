const http = require("http")

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello World!</h1>')
})

server.listen(3000, () => {
    console.log('Server has been started')
})