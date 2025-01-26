const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cacheParam = url.searchParams.get('cache_param');

    if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Welcome to the caching example! This is a new image!</h1>
            <img src="/image?cache_param=max-age" alt="Image">
            <script src="/script?cache_param=no-store"></script>
            <link rel="stylesheet" href="/style?cache_param=max-age">
        `);
    } else if (url.pathname === '/image') {
        handleImage(res, cacheParam);
    } else if (url.pathname === '/script') {
        handleScript(res, cacheParam);
    } else if (url.pathname === '/style') {
        handleStyle(res, cacheParam);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const handleImage = (res, cacheParam) => {
    const filePath = path.join(__dirname, 'image.png');
    const stats = fs.statSync(filePath);
    const lastModified = stats.mtime.toUTCString();
    const etag = stats.size.toString();

    // Заголовки для кеширования
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Last-Modified', lastModified);
    res.setHeader('ETag', etag);

    switch (cacheParam) {
        case 'no-cache':
            res.setHeader('Cache-Control', 'no-cache');
            break;
        case 'no-store':
            res.setHeader('Cache-Control', 'no-store');
            break;
        case 'max-age':
            res.setHeader('Cache-Control', 'max-age=3600'); 
            break;
        default:
            res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    fs.createReadStream(filePath).pipe(res);
};

const handleScript = (res, cacheParam) => {
    const scriptContent = 'console.log("Hello, Wor!");';
    const lastModified = new Date().toUTCString();
    const etag = 'script-etag';

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Last-Modified', lastModified);
    res.setHeader('ETag', etag);

    switch (cacheParam) {
        case 'no-cache':
            res.setHeader('Cache-Control', 'no-cache');
            break;
        case 'no-store':
            res.setHeader('Cache-Control', 'no-store');
            break;
        case 'max-age':
            res.setHeader('Cache-Control', 'max-age=10'); 
            break;
        default:
            res.setHeader('Cache-Control', 'public, max-age=60');
    }

    res.end(scriptContent);
};

const handleStyle = (res, cacheParam) => {
    const styleContent = 'body { background-color: #000; }';
    const lastModified = new Date().toUTCString();
    const etag = 'style-etag';

    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Last-Modified', lastModified);
    res.setHeader('ETag', etag);

    switch (cacheParam) {
        case 'no-cache':
            res.setHeader('Cache-Control', 'no-cache');
            break;
        case 'no-store':
            res.setHeader('Cache-Control', 'no-store');
            break;
        case 'max-age':
            res.setHeader('Cache-Control', 'max-age=30'); 
            break;
        default:
            res.setHeader('Cache-Control', 'public, max-age=30');
    }

    res.end(styleContent);
};

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});