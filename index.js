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
// app.use(authMiddleware);
app.use(express.json());

app.get('/user', (req, res) => {
    res.send({
        name: req.user.name,
        age: req.user.age,
    })
})

app.get('/check-auth', (req, res) => {
    const token = req.header('Authorization')?.replace('My-Token ', '')
    const currentUser = users.find(user => user.token === token)
    if (currentUser) {
        res.send({
            userId: currentUser.id,
            isAuth: true
        })
    } else {
        res.send({isAuth: false})
    }
})

const NOTE_APP_ACCESS_TOKEN = 'note-app-secret-key'

app.get('/notes', (req, res) => {
    const token = req.header('Authorization')?.replace('My-Token ', '')
    if (token !== NOTE_APP_ACCESS_TOKEN) {
        return res.send({
            error: "Don't have access to this resource"
        })
    }
    const userId = Number(req.query.userId);
    const user = users.find(user => user.id === userId);
    res.send(user?.notes)
})

app.route('/note')
    .put((req, res) => {
        const {id, text, title} = req.body;
        console.log(id, text, title)
        const userId = Number(req.query.userId);
        const updatedUser = users.find(user => user.id === userId);
        if (!updatedUser)
            res.send({
                error: 'User does not exist'
            })
        let result;
        updatedUser.notes = updatedUser?.notes.map(note => {
            if (note.id === id) {
                result = {...note, text, title}
                return result
            }
            else {
                return note
            }
        })
        console.log(updatedUser)
        res.send(result)
    })
  .delete((req, res) => {
      const userId = Number(req.query.userId);
      const noteId = Number(req.query.noteId);
      const updatedUser = users.find(user => user.id === userId);
      if (!updatedUser) {
          res.send({
              error: 'User does not exist'
          })
      }
      updatedUser.notes = updatedUser?.notes.filter(note => note.id !== noteId)
      console.log(updatedUser);
      res.send({
        success: true,
      })
  })

app.post('/login', (req, res) => {
    console.log(req.body)
    const {login, password} = req.body;
    const user = users.find(user => user.login === login);
    if (user && user.password === password) {
        res.send({
            token: user.token,
            userId: user.id,
        })
    } else {
        res.send({
            error: 'Incorrect login or password'
        })
    }
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
