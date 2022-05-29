const express = require('express')
const app = express()
const {ref, set, push, get, child, remove, update} = require("firebase/database");

const db = require("./firebase");
const dbRef = ref(db);
const PORT = 8001

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use(express.json());

app.post('/create-account', (req, res) => {
  console.log(req.body)
  const usersRef = ref(db, 'users/');
  const {login, ...rest} = req.body;
  const tokenKey = push(usersRef).key;
  const token = tokenKey + '-token';
  const user = {
    token, login, notes: {}, ...rest
  }
  const userId = push(usersRef, user).key;
  set(ref(db, `users/${userId}`), {...user, id: userId})
    .then(() =>  res.send({
      token: user.token,
      userId,
    }))
    .catch(() => res.send({
      error: 'Something went wrong'
    }));
})

app.post('/login', (req, res) => {
  console.log('/login')
  console.log(req.body)
  const {login, password} = req.body;
  get(child(dbRef, `users/`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      const users = snapshot.val();
      for (const userId in users) {
        if (users[userId].login === login) {
          if (users[userId].password === password) {
            return res.send({
              userId,
              token: users[userId].token,
              isAuth: true
            })
          } else {
            res.send({error: 'Password is incorrect'})
          }
        }
      }
    }
    return res.send({error: 'User does not exist'})
  }).catch((error) => {
    res.send({
      isAuth: false,
      error,
    })
  });
})

app.get('/check-auth', async (req, res) => {
    const token = req.header('Authorization')?.replace('My-Token ', '')
    get(child(dbRef, `users/`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const users = snapshot.val();
        for (const userId in users) {
          if (users[userId].token === token) {
            return res.send({
              userId,
              isAuth: true
            })
          }
        }
      }
      return res.send({
        error: 'User not found'
      })
    }).catch((error) => {
      return res.send({
        isAuth: false,
        error,
      })
    });
})

const USER_APP_ACCESS_TOKEN = 'user-app-secret-key';

app.route('/user')
  .get((req, res) => {
    console.log('/user')
    const token = req.header('Authorization')?.replace('My-Token ', '')
    if (token !== USER_APP_ACCESS_TOKEN) {
      return res.send({
        error: "Don't have access to this resource"
      })
    }
    const userId = String(req.query.id);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const user = snapshot.val();
        return res.send({
          name: user.name,
          id: user.id,
          login: user.login,
        })
      }
      return res.send({
        error: 'User not found'
      })
    }).catch((error) => {
      return res.send({
        error,
      })
    });
  })

const NOTE_APP_ACCESS_TOKEN = 'note-app-secret-key'

app.get('/notes', (req, res) => {
    console.log('/notes');
    const token = req.header('Authorization')?.replace('My-Token ', '')
    if (token !== NOTE_APP_ACCESS_TOKEN) {
        return res.send({
            error: "Don't have access to this resource"
        })
    }
    const userId = String(req.query.userId);
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const user = snapshot.val();
        return res.send({
          notes: user.notes ? Object.keys(user.notes).map(id => user.notes[id]) : [],
        })
      }
      return res.send({
        error: 'User not found'
      })
    }).catch((error) => {
      return res.send({
        error,
      })
    });
})

app.route('/note')
    .put(async (req, res) => {
        const {id: noteId, text = "", title = ""} = req.body;
        console.log(noteId, text, title)
        const userId = String(req.query.userId);
        const snapshot = await get(ref(db, `users/${userId}/notes/${noteId}`))
        if (!snapshot.exists()) {
          return res.send({
            error: 'Note does not exist'
          })
        }
        update(ref(db, `users/${userId}/notes/${noteId}`), {text, title})
          .then(() => res.send({
              text, title, id: noteId
            })
          )
          .catch(() => res.send({
            error: 'Something went wrong'
          }));
    })
    .delete(async (req, res) => {
      console.log('/delete');
      const userId = String(req.query.userId);
      const noteId = String(req.query.noteId);
      console.log('noteId: ', noteId);
      remove(ref(db, `users/${userId}/notes/${noteId}`))
        .then(() => res.send({
          success: true,
        })
        )
        .catch(() => res.send({
            error: 'Something went wrong'
        }));

  })
    .post((req, res) => {
      const userId = String(req.query.userId);
      const notesRef = ref(db, `users/${userId}/notes`);
      const newNote = {
        text: '',
        title: '',
      }
      if (!notesRef) {
        res.send({
          error: 'User does not exist'
        })
      }
      const newNoteId = push(notesRef, newNote).key;
      set(ref(db, `users/${userId}/notes/${newNoteId}`), {...newNote, id: newNoteId})
        .then(() => res.send({
          success: true,
          id: newNoteId,
        }))
        .catch(() => res.send({
          error: 'Something went wrong'
        }))

  })
    .all((req, res) => {
    const token = req.header('Authorization')?.replace('My-Token ', '')
    if (token !== NOTE_APP_ACCESS_TOKEN) {
      return res.send({
        error: "Don't have access to this resource"
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
