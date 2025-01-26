const fs = require('fs');
const path = require('path');

class FileServer {
    constructor(staticDir = './static') {
        this.staticDir = staticDir;
    }

    getFullPath(filePath) {
        return path.join(this.staticDir, filePath);
    }

    send404(res) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Resource not found');
    }

    send405(res){
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Method Not Alowed');
    }

    streamFile(req, res, headers) {
        res.writeHead(200, headers);
        fs.readFile(this.getFullPath(req.url), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            } else {
                res.end(data);
            }
        });
    }

    isValidExtension(ext, requestedPath) {
        const regex = new RegExp(`^\/.+\.${ext}$`);
        return regex.test(requestedPath);
    }

    serverFile(req, res, headers) {
        fs.access(this.getFullPath(req.url), fs.constants.R_OK, (error) => {
            if (error) {
                this.send404(res);
            } else {
                this.streamFile(req, res, headers);
            }
        });
    }
}

module.exports = (dir) => new FileServer(dir);