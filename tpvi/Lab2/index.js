import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/calc', (req, res) => {
    const x = parseInt(req.headers['x-value-x'])
    const y = parseInt(req.headers['x-value-y'])
    const z = x + y

    res.set('X-Value-z', z.toString())
    res.setHeader('Access-Control-Expose-Headers', 'X-Value-z')
    res.sendStatus(200)
    res.end()
})

app.listen(PORT, () => {
    console.log(`Server has been started!`)
});