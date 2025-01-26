const WebSocket = require('ws');

const wsServer = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/broadcast' });

wsServer.on('connection', wscon => {
    console.log('Connection to WebSocket server');

    const interval = setInterval(() => {
        if (wscon.readyState === WebSocket.OPEN) {
            wscon.ping(); 
        }
    }, 15000);

    wscon.on('message', message => {
        wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('server: ' + message);
            }
        });
    });

    wscon.on('pong', () => {
        console.log('Received pong from client');
    });

    wscon.on('close', () => {
        clearInterval(interval); 
        console.log('Socket closed');
    });
});

wsServer.on('error', (e) => {
    console.log('ws server error', e);
});

console.log(`ws server: host: ${wsServer.options.host}, port: ${wsServer.options.port}, path: ${wsServer.options.path}`);