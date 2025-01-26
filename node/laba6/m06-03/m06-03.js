const nodemailer = require('nodemailer');

const auth = {
    type: 'oauth2',
    user: 'nastenas714@gmail.com',
    clientId: '791766358045-0tenkv6qjjkep9pcm7kvihi6hit7ccfu.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04E0boTI2btXpCgYIARAAGAQSNwF-L9Irpi-Jf8fMRfcT9m19ZmEIxD7vrtV9apregckxJxI39X6J6LDfTgHnX4Jcm7FH412ATeQ',
    accessToken: 'ya29.a0AeDClZD4pGWP7DXlHI_nwsV-DKMqQ57IM_8p6DeaR630DdYWzsFF7_R7PqnalHX4OgsqRn7ud17NRSlb1EHdW9aKKE87cZexC1UEgPvIxsosxCnHdFkYQHspzHPHTCDIwW-07Ehwi-2VhtUAPqdWf-FfTtNlScWEPPyyxyUSaCgYKAZISARMSFQHGX2MiX--77bGnm8RaPElqQQIIZg0175'
};


const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'mail.google.com',
    auth: auth
});
    
async function send(messageStr) {
       
    const senderEmail = 'nastenas714@gmail.com';
    const receiverEmail = 'azimovan003@gmail.com';
    
    const message = {
        from: senderEmail,
        to: receiverEmail,
        subject: 'LAB06',
        text: messageStr
    };
    
    return new Promise((resolve, reject) => {
        transport.sendMail(message, function(error) {
            if (error) {
                console.log(error);
                reject(error); 
            } else {
                console.log('success');
                resolve();
            }
        });
    });
}
    
module.exports = send;