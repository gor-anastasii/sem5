import { createServer } from "http"
import { parse } from "url"; 
import { db } from "./db.js"
import EventEmitter from "events";
import * as fs from 'fs'

const PORT = 5000
const eventEmitter = new EventEmitter();

const server = createServer(async (req, res) => {
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

        switch (req.method) {
            case "GET":
                eventEmitter.emit('get', res);
                break;

            case "POST":
                let postBody = '';
                req.on('data', (chunk) => {
                    postBody += chunk;
                });

                req.on('end', () => {
                    const { id, name, birthday } = JSON.parse(postBody);
                    eventEmitter.emit('insert', res, id, name, birthday);
                });
                break;

            case "PUT":
                let putBody = '';
                req.on('data', (chunk) => {
                    putBody += chunk;
                });

                req.on('end', () => {
                    const { id, name, birthday } = JSON.parse(putBody);
                    eventEmitter.emit('update', res, id, name, birthday);
                });
                break;

            case "DELETE":
                const id = Number(query.id);
                eventEmitter.emit('delete', res, id);
                break;

            default:
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end('Method not found');
        }
    } else {
        res.writeHead(404)
        res.end('Page not found')
    } 
})


eventEmitter.on('get', async (res) => {
    const data = await db.select();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
});

eventEmitter.on('insert', async (res, id, name, birthday) => {
    const newUser = await db.insert(id, name, birthday);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
});

eventEmitter.on('update', async (res, id, name, birthday) => {
    const changedUser = await db.update(id, name, birthday);
    if (changedUser) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(changedUser));
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end('User not found');
    }
});

eventEmitter.on('delete', async (res, id) => {
    const deletedUser = await db.delete(id);
    if (deletedUser) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(deletedUser));
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end('User not found');
    }
});

server.listen(PORT, () => console.log('Server has been started!'))