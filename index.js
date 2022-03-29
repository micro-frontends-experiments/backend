const express = require('express')
const app = express()
const PORT = 8001

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

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
