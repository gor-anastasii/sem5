const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.post('/api/data', (req, res) => {
    const { x, y } = req.body;

    if (!req.session.sums) {
        req.session.sums = { sx: 0, sy: 0, count: 0 };
    }

    req.session.sums.sx += x;
    req.session.sums.sy += y;
    req.session.sums.count++;

    if (req.session.sums.count % 5 === 0) {
        const response = { sx: req.session.sums.sx, sy: req.session.sums.sy };
        req.session.sums = { sx: 0, sy: 0, count: 0 };
        return res.json(response);
    }

    const response = { sx: req.session.sums.sx, sy: req.session.sums.sy };
    res.json(response);
});


app.listen(PORT, () => {
    console.log(`Server is running!`);
});