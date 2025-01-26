import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())

app.post('/random-numbers', (req, res) => {
    const n = parseInt(req.headers['x-rand-n'], 10)

    if (!isNaN(n)) {
        const count = Math.floor(Math.random() * (6)) + 5
        const randomNumbers = Array.from({ length: count }, 
            () => Math.floor(Math.random() * (2 * n + 1)) - n)
        
        res.json(randomNumbers)
    } else {
        res.status(400).send('Invalid input')
    }
})

app.listen(PORT, () => {
    console.log(`Server has been started!`)
})