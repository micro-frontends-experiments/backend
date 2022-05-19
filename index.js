const express = require('express')
const app = express()
const {users} = require("./db");
const PORT = 8001

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use(express.json());

const USER_APP_ACCESS_TOKEN = 'user-app-secret-key';

app.route('/user')
  .get((req, res) => {
    const token = req.header('Authorization')?.replace('My-Token ', '')
    if (token !== USER_APP_ACCESS_TOKEN) {
        return res.send({
            error: "Don't have access to this resource"
        })
    }
    const userId = Number(req.query.id);
    const foundedUser = users.find(user => user.id === userId);
    if (foundedUser) {
        res.send({
            name: foundedUser.name,
            id: foundedUser.id,
            login: foundedUser.login,
        })
    } else {
        res.send({
            error: 'User not found'
        })
    }
  })

app.post('/create-account', (req, res) => {
  console.log(req.body)
  const {name, login, ...rest} = req.body;
  const token = login + '-token';
  const id = String(Date.now()) + login;
  const user = {
    name, token, id, notes: [], ...rest
  }
  users.push(user);
  res.send({
    token: user.token,
    userId: user.id,
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
        updatedUser.notes = updatedUser.notes.map(note => {
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
  .post((req, res) => {
      const userId = Number(req.query.userId);
      const updatedUser = users.find(user => user.id === userId);
      if (!updatedUser)
        res.send({
          error: 'User does not exist'
        })
      const newNoteId = Date.now();
      updatedUser.notes.unshift({id: newNoteId, text: '', title: ''})
      console.log(updatedUser)
      res.send({
        success: true,
        id: newNoteId,
      })
  })
  .all((req, res) => {
    const token = req.header('Authorization')?.replace('My-Token ', '')
    if (token !== NOTE_APP_ACCESS_TOKEN) {
      return res.send({
        error: "Don't have access to this resource"
      })
    }
  })

app.post('/login', (req, res) => {
    console.log(req.body)
    const {login, password} = req.body;
    const user = users.find(user => user.login === login);
    if (!user) {
      res.send({
        error: 'User not found'
      })
    }
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
