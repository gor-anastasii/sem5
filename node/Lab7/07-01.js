const http = require('http');
const fileServer = require('./m07_01')('./static');

const server = http.createServer((req, res) => {

    if ( req.method != 'GET') 
        {
            fileServer.send405(res);
            return;
        }
    if (fileServer.isValidExtension('html', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'text/html; charset=utf-8'});

    } else if (fileServer.isValidExtension('css', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'text/css; charset=utf-8'});

    } else if (fileServer.isValidExtension('js', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'application/javascript'});

    } else if (fileServer.isValidExtension('png', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'image/png'});

    } else if (fileServer.isValidExtension('docx', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'application/msword'});

    } else if (fileServer.isValidExtension('json', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'application/json'});

    } else if (fileServer.isValidExtension('xml', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'application/xml'});

    } else if (fileServer.isValidExtension('mp4', req.url)) {
        fileServer.serverFile(req, res, {'Content-Type': 'video/mp4'});

    } else {
        fileServer.send404(res);
    }
});
server.listen(5000, () => {
    console.log(`Server has been started`);
});