const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

let sumX = 0
let sumY = 0
let count

app.post('/', (req, res) => {
    const { x, y } = req.body
    const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl

    if (typeof x !== 'number' || typeof y !== 'number' || x <= 0 || y <= 0) {
        return res.status(400).json({ error: 'Invalid input', url: requestUrl })
    }

    count = parseInt(req.cookies.requestCount) || 0
    count++

    if (count === 1) {
        res.cookie('requestCount', count)
        res.json({ sx: x, sy: y, url: requestUrl })
    } else {
        sumX += x
        sumY += y

        if (count % 5 === 0) {
            res.cookie('requestCount', count)
            res.json({ sx: sumX, sy: sumY, url: requestUrl })
            sumX = 0
            sumY = 0
        } else {
            res.cookie('requestCount', count)
            res.json({ sx: sumX, sy: sumY, url: requestUrl })
        }
    }
})


app.listen(5000, () => {
    console.log(`Server has been started!`)
})
