const users = [
  {
    login: 'admin@mail.com',
    password: 'supersecret',
    age: 35,
    token: 'admin-token',
    notes: [
      {
        title: 'Note 1',
        text: 'Hey, i am admin note 1',
        id: 1,
      },
      {
        title: 'Note 2',
        text: 'Hey, i am admin note 2',
        id: 2,
      },
    ]
  },
  {
    login: 'user@mail.com',
    password: 'secret',
    age: 20,
    token: 'user-token',
    notes: [
      {
        title: 'Note 1',
        text: 'Hey, i am user note 1'
      },
    ]
  },
]

module.exports = {
  users
}