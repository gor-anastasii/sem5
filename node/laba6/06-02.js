const http = require('http');
const url = require('url');
const fs = require('fs');
const { parse } = require('querystring');
const nodemailer = require('nodemailer');

const auth = {
    type: 'oauth2',
    user: 'nastenas714@gmail.com',
    clientId: '791766358045-0tenkv6qjjkep9pcm7kvihi6hit7ccfu.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04E0boTI2btXpCgYIARAAGAQSNwF-L9Irpi-Jf8fMRfcT9m19ZmEIxD7vrtV9apregckxJxI39X6J6LDfTgHnX4Jcm7FH412ATeQ',
    accessToken: 'ya29.a0AeDClZD4pGWP7DXlHI_nwsV-DKMqQ57IM_8p6DeaR630DdYWzsFF7_R7PqnalHX4OgsqRn7ud17NRSlb1EHdW9aKKE87cZexC1UEgPvIxsosxCnHdFkYQHspzHPHTCDIwW-07Ehwi-2VhtUAPqdWf-FfTtNlScWEPPyyxyUSaCgYKAZISARMSFQHGX2MiX--77bGnm8RaPElqQQIIZg0175'
};


http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    if (url.parse(request.url).pathname === '/' && request.method === 'GET') 
    {
        response.end(fs.readFileSync('./06-02.html'));
    }
    else if (url.parse(request.url).pathname === '/' && request.method === 'POST') 
    {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });

        request.on('end', () => {
            let parm = parse(body);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'mail.google.com',
                auth: auth
            });

            const mailOptions = {
                from: parm.sender,
                to: parm.receiver,
                subject: parm.subject,
                text: parm.message
            }

            transporter.sendMail(mailOptions, (err, info) => {
                
                err ? console.log(err) : console.log('Sent: ' + info.response);
            })

            response.end(`<h2>Отправитель: ${parm.sender}</br>Получатель: ${parm.receiver}
                    </br>Тема: ${parm.subject}</br>Сообщение: ${parm.message}</h2>`);
        })
    }

    else
        response.end('<html><body><h1>Error! Visit localhost:5000/</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000/\n'));

