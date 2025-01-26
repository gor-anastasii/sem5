const http = require('http')
const sendmail = require('sendmail')()
const { parse } = require('querystring')

const PORT = 3000

// Создаем сервер
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {

    let body = ''
    req.on('data', str => {
      body += str.toString()
    })

    req.on('end', () => {
      const { sender, recipient, message } = parse(body)

      sendmail({
        from: sender,
        to: recipient,
        subject: 'New Message',
        html: `<p>${message}</p>`,
        smtp: {
            host: 'smtp.gmail.com',
            port: 587, // или 465
            secure: false, // если используете 587
        },
      }, (err, reply) => {
        if (err) {
          console.error(err && err.stack)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          return res.end('Ошибка при отправке письма.')
        }
        console.dir(reply)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Письмо успешно отправлено!')
      });
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
    res.end(`
      <form action="/" method="POST">
        <label for="sender">Отправитель:</label>
        <input type="email" id="sender" name="sender" required>
        <br>
        <label for="recipient">Получатель:</label>
        <input type="email" id="recipient" name="recipient" required>
        <br>
        <label for="message">Сообщение:</label>
        <textarea id="message" name="message" required></textarea>
        <br>
        <button type="submit">Отправить</button>
      </form>
    `)
  }
})

server.listen(PORT, () => {
  console.log(`Сервер запущен!`)
})