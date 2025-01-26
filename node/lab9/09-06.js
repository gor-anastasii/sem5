const http = require('http');
const fs = require('fs');
const FormData = require('form-data');


 const boundary = 'bluebox--bluebox';

let body = `--${boundary}\r\n`;
body += 'Content-Disposition: form-data; name="file"; filename="MyFile.txt"\r\n';
body += 'Content-Type: text/plain\r\n\r\n';
body += fs.readFileSync("./MyFile.txt", "utf8");
body += `\r\n--${boundary}--\r\n`;


const options = {
    hostname: 'localhost',
    port: 5000, 
    path: '/6', 
    method: 'POST',
    headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
    }
    
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`Статус ответа: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Данные ответа:');
        console.log(data);
    });
});

req.on('error', (error) => {
    console.error(`Ошибка запроса: ${error.message}`);
});

req.write(body);
req.end();
