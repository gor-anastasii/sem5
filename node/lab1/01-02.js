const http = require('http')
const port = 3000

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const headers = req.headers

    let body = ''
    req.on('data', str => {
        body += str.toString()
    })

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        const resHtml = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lab1</title>
            </head>
            <body>
                <p><strong>Метод:</strong> ${method}</p>
                <p><strong>URI:</strong> ${url}</p>
                <p><strong>Версия протокола:</strong> ${req.httpVersion}</p>
                <h2>Заголовки:</h2>
                <p>${JSON.stringify(headers, null, 2)}</p>
                <h2>Тело запроса:</h2>
                <p>${body}</p>
            </body>
            </html>
        `

        res.end(resHtml)
    })
})

server.listen(port, () => {
    console.log(`Server has been started!`)
})