const express = require('express')
const app = express()
const authMiddleware = require("./middlewares");
const {users} = require("./db");
const PORT = 8001

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use(authMiddleware);
app.use(express.json());

app.get('/user', (req, res) => {
    res.send({
        name: 'Admin',
        age: 35,
    })
})

app.post('/login', (req, res) => {
    console.log(req.body)
    const {login, password} = req.body;
    const user = users.find(user => user.login === login);
    if (user && user.password === password) {
        res.send({
            token: user.token
        })
    } else {
        res.send({
            error: 'Incorrect login or password'
        })
    }
})

app.post('/user', (req, res) => {
    console.log(req.body)
    res.send({
        name: 'Admin',
        age: 35,
    })
})

app.get('/micro-app-1', (req, res) => {
    res.send({
        title: 'App 1'
    })
})

app.get('/micro-app-2', (req, res) => {
    res.send({
        title: 'App 2'
    })
})

app.get('/root-app', (req, res) => {
    res.send({
        title: 'Root App'
    })
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT || PORT}`)
})
