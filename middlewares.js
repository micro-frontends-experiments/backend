const {users} = require('./db');
const PAGES_WITHOUT_PROTECT = ['/login']

const authMiddleware = (req, res, next) => {
  if (
    req.method === 'OPTIONS'
    || PAGES_WITHOUT_PROTECT.includes(req.path)
  ) {
    return next();
  }

  const token = req.header('Authorization')?.replace('My-Token ', '')
  const user = users.find(user => user.token === token)

  if (user) {
    req.user = user
    req.token = token
    next()
  } else {
    res.status(200).send(
      {
        error: 'Not authorized to access this resource',
        authRedirect: true,
      })
  }
}

module.exports = authMiddleware