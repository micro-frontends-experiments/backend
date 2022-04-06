const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth')
const PORT = 8001

// app.use(basicAuth({
//     users: { 'admin': 'supersecret' }
// }))

app.get('/micro-app-1', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send({
        title: 'App 1'
    })
})

app.get('/micro-app-2', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send({
        title: 'App 2'
    })
})

app.get('/root-app', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send({
        title: 'Root App'
    })
})

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send('Hello, world!')
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT || PORT}`)
})
