import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// app.post('/calc', (req, res) => {
//     const x = parseInt(req.headers['x-value-x'])
//     const y = parseInt(req.headers['x-value-y'])
//     const z = x + y

//     res.set('X-Value-z', z.toString())
//     res.setHeader('Access-Control-Expose-Headers', 'X-Value-z')
//     res.sendStatus(200)
//     res.end()
// })

app.post('/calc', (req, res) => {
    const x = parseInt(req.headers['x-value-x'], 10)
    const y = parseInt(req.headers['x-value-y'], 10)

    setTimeout(() => {
        if (!isNaN(x) && !isNaN(y)) {
            const z = x + y
            res.setHeader('X-Value-z', z)
            res.setHeader('Access-Control-Expose-Headers', 'X-Value-z')
            res.status(200).send('Sum calculated')
        } else {
            res.status(400).send('Invalid input')
        }
    }, 10000)
})

app.post('/random-numbers', (req, res) => {
    const n = parseInt(req.headers['x-rand-n'], 10)

    setTimeout(() => {
        if (!isNaN(n)) {
            const count = Math.floor(Math.random() * (6)) + 5
            const randomNumbers = Array.from({ length: count },
                () => Math.floor(Math.random() * (2 * n + 1)) - n)
            res.json(randomNumbers)
        } else {
            res.status(400).send('Invalid input')
        }
    }, 1000)
})

app.listen(PORT, () => {
    console.log(`Server has been started!`)
})