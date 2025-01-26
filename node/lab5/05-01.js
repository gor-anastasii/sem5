import { createServer } from "http"
import { parse } from "url" 
import { db } from "./db.js"
import * as fs from 'fs'
import { stdin } from 'process'

const PORT = 5000

let shutdownTimeout
let commitInterval
let statsCollectionInterval
let requestCount = 0
let commitCount = 0
let statsStartTime = null
let statsEndTime = null

const server = createServer(async (req, res) => {
    requestCount++

    if(req.url === "/"){
        fs.readFile("index.html", function (err, data){
            if(err){
                res.writeHead(500, {"Content-Type": "text/plain"})
                res.end("Server error!")
            } else {
                res.writeHead(200, { "Content-Type": "text/html" })
                res.end(data)
            }
        })
    } else if (req.url.startsWith("/api/db")) {
        const { query } = parse(req.url, true);

        switch (req.method){
            case "GET": {
                const data = await db.select()
                res.writeHead(200, {"Content-Type" : "application/json"})
                res.end(JSON.stringify(data))
                break
            }

            case "POST": {
                let body = ''
                req.on('data', (str) => {
                    body += str
                })

                req.on('end', async () => {
                    const { id, name, birthday} = JSON.parse(body)
                    const newUser = await db.insert(id, name, birthday)
                    res.writeHead(200, {"Content-Type" : "application/json"})
                    res.end(JSON.stringify(newUser))
                })
                break
            }

            case "PUT": {
                let body = ''
                req.on('data', (str) => {
                    body += str
                })

                req.on('end', async () => {
                    const {id, name, birthday} = JSON.parse(body)
                    const changedUser = await db.update(id, name, birthday)
                    if(changedUser){
                        res.writeHead(200, {"Content-Type" : "application/json"})
                        res.end(JSON.stringify(changedUser))
                    } else {
                        res.writeHead(500, {"Content-Type" : "text/plain"})
                        res.end('User not found')
                    } 
                })
                break
            }

            case "DELETE": {
                const id = Number(query.id)
                const deletedUser = await db.delete(id)
                if(deletedUser){
                    res.writeHead(200, {"Content-Type" : "application/json"})
                    res.end(JSON.stringify(deletedUser))
                } else {
                    res.writeHead(500, {"Content-Type" : "text/plain"})
                    res.end('User not found')
                }
                break
            }

            default: {
                res.writeHead(500, {"Content-Type" : "text/plain"})
                res.end('Method not found')
            }
        }
    } else if (req.url === "/api/ss" && req.method === "GET") {
        const statsResponse = {
            startTime: statsStartTime ? statsStartTime.toISOString() : '',
            endTime: statsEndTime ? statsEndTime.toISOString() : '',
            requestCount,
            commitCount,
        }

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(statsResponse))
    }  else {
        res.writeHead(404)
        res.end('Page not found')
    } 
})

const handleCommand = (command) => {
    const [cmd, param] = command.split(" ")

    switch (cmd) {
        case 'sd': { 
            const seconds = Number(param)
            clearTimeout(shutdownTimeout)

            if (!isNaN(seconds)) {
                shutdownTimeout = setTimeout(() => {
                    console.log("Сервер выключается...")
                    server.close(() => {
                        console.log("Сервер остановлен.");
                        process.exit(0)
                    })
                }, seconds * 1000)
                console.log(`Сервер будет выключен через ${seconds} секунд.`)
            } else {
                console.log("Остановка сервера отменена.")
            }
            break
        }

        case 'sc': {
            const seconds = Number(param)
            clearInterval(commitInterval)

            if (!isNaN(seconds)) {
                commitInterval = setInterval(async () => {
                    await db.commit()
                    commitCount++
                }, seconds * 1000).unref()
                console.log(`Периодическая фиксация каждые ${seconds} секунд запущена.`)
            } else {
                console.log("Периодическая фиксация остановлена.")
            }
            break
        }

        case 'ss': { 
            const seconds = Number(param)
            clearInterval(statsCollectionInterval)
            if (!isNaN(seconds)) {
                statsStartTime = new Date()
                statsCollectionInterval = setInterval(() => {
                    console.log(`Запросов: ${requestCount}, Фиксаций: ${commitCount}`)
                }, seconds * 1000).unref()
                console.log(`Сбор статистики каждые ${seconds} секунд запущен.`)
            } else {
                statsEndTime = new Date()
                clearInterval(statsCollectionInterval)
                console.log("Сбор статистики остановлен.")
            }
            break
        }
        default: {
            console.log("Неизвестная команда.")
        }
    }
}

stdin.on('data', data => {
    const command = data.toString().trim()
    handleCommand(command)
})

server.listen(PORT, () => {
    statsStartTime = new Date()
    console.log('Сервер запущен!')
})