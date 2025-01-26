const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

const boundary = 'bluebox2--bluebox2';
let body = `--${boundary}\r\n`;
body += 'Content-Disposition: form-data; name="file"; filename="pngwing.png"\r\n';
body += 'Content-Type: application/octet-stream\r\n\r\n'; 

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/7', 
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`Статус ответа: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('http.response: end: length body =', Buffer.byteLength(data));
    });
});

req.on('error', (error) => {
    console.error(`Ошибка запроса: ${error.message}`);
});

req.write(body)

let stream = new fs.createReadStream('./pngwing.png');

stream.on('data', (chunk) => {
  req.write(chunk); 
  console.log(Buffer.byteLength(chunk));
});
stream.on('end', () => {
  req.end(`\r\n--${boundary}--\r\n`); 
});
