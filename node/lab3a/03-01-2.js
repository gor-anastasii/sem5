const http = require('http')
const port = 5000

const states = [ 'norm', 'stop', 'test', 'idle']
let currentState = 'norm'

process.stdin.setEncoding('utf8')

process.stdin.on('data', (data) => {
    const state = data.trim()

    if (states.includes(state)) {
        currentState = state
        console.log(`Состояние успешно переключено на ${currentState}`)
    } else if (state === 'exit') {
        console.log('Завершение работы сервера...')
        process.exit(0);
    } else {
        console.log(`Ошибочный ввод: ${state}`)
    }
    console.log(`Текущее состояние: ${currentState}.\nВведите новое состояние (norm, stop, test, idle, exit): `)
})

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${currentState}`)
})

server.listen(port, () => {
    console.log('Сервер запущен.\nДля его управления можно использовать консоль.')
    console.log(`Текущее состояние: ${currentState}.\nВведите новое состояние (norm, stop, test, idle, exit): `)
})
