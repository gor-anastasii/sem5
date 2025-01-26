const http = require('http');
const url = require("url");
const parseString = require('xml2js').parseString;
const mp = require('multiparty');
const fs = require("fs");
const querystring = require('querystring');


http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);
    const { x, y } = parsedUrl.query;

    switch (parsedUrl.pathname) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`Task first`);
            break;

        case "/2": {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let x = parsedUrl.query.x;
            let y = parsedUrl.query.y;
            res.end(`Second task x = ${x}, y = ${y}`);
            break;
        }

        case "/3": {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                const parsedBody = querystring.parse(data);
                const x = parsedBody.x;
                const y = parsedBody.y;
                const s = parsedBody.s;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`Third task x = ${x}, y = ${y}, s = ${s}`);
            });

            break;
        }

        case "/4":
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                data = JSON.parse(data);
                res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
                let resp = {};
                resp.__comment = data.comment ;
                resp.x_plus_y = data.x + data.y;
                resp.Concatenation_s_o = data.s + ': ' + data.o.surname + ', ' + data.o.name;
                resp.Length_m = data.m.length;
                res.end(JSON.stringify(resp));
            });
            break;

        case "/5": {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                parseString(data, (err, result) => {
                    res.writeHead(200, { 'Content-type': 'application/xml' });
                    let id = result.request.$.id;
                    let sum = 0;
                    let concat = '';
                    result.request.x.forEach((p) => {
                        sum += parseInt(p.$.value);
                    });
                    result.request.m.forEach((p) => {
                        concat += p.$.value;
                    });

                    let responseText = `<response id="33" request="${id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                    res.end(responseText);
                });
            });
            break;
        }

        case "/6":
            let body = "";
            const boundary = req.headers["content-type"].split("boundary=")[1];

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const parts = body.split(`--${boundary}`).filter((part) => part.trim() !== "" && part.trim() !== "--");

                const parsedData = parts.map((part) => {
                    const headersEnd = part.indexOf("\r\n\r\n");
                    const headers = part.slice(0, headersEnd).trim();
                    const contentEnd = part.indexOf(`\r\n--${boundary}`);
                    const content = part.slice(headersEnd + 4, contentEnd !== -1 ? contentEnd : part.length).trim();

                    return { headers, content };
                });

                console.log("Parsed data:", parsedData);
                const fileContent = parsedData.map((data) => data.content).join("\n"); 

                fs.writeFile("MyFile2.txt", fileContent, (err) => {
                    if (err) {
                        console.error("Ошибка записи в файл:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ status: "error", message: "Ошибка записи в файл" }));
                        return;
                    }
                    console.log("Данные успешно записаны в MyFile2.txt");

                });
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "success", data: parsedData }));

            });
            break;

        case "/7":
            if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
                const boundary = req.headers['content-type'].split('boundary=')[1];
                const boundaryBuffer = Buffer.from(`--${boundary}`);
                const buffer = [];
        
                req.on('data', (chunk) => {
                    buffer.push(chunk);
                });
                req.on('end', () => {
                    const body = Buffer.concat(buffer);
                    //console.log(body);
    
                    const parts = [];
                    let startIndex = 0;
                    while (startIndex < body.length) {
                        const endIndex = body.indexOf(boundaryBuffer, startIndex);
                        if (endIndex === -1) break;
                        parts.push(body.slice(startIndex, endIndex));
                        startIndex = endIndex + boundaryBuffer.length;
                    }
    
                    let fileData;
                    parts.forEach(part => {
                        const contentDisposition = part.indexOf('Content-Disposition: form-data; name="file"');
                        if (contentDisposition !== -1) {
                            const contentStart = part.indexOf('\r\n\r\n') + 4;
                            const contentEnd = part.lastIndexOf('\r\n');
                            fileData = part.slice(contentStart, contentEnd);
                        }
                    });
        
                    if (fileData) {
                        fs.writeFileSync('UploadedFile.png', fileData); // Запись бинарных данных
                        console.log('Файл сохранен как UploadedFile.png');
        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'success', filename: 'UploadedFile.png' }));
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'error', message: 'Файл не найден в запросе' }));
                    }
                });
            } else {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.end('Only POST method is supported');
            }
            break;

        case "/8":
            res.writeHead(200, { 'Content-Type': 'text/html' });
            let file = fs.readFileSync("./server.png");
            console.log("Успешно");
            res.end(file);
            break;
    }
}).listen(5000, () => console.log('http://localhost:5000'));