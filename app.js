const express = require('express')
const app = express()
const engine = require('ejs-locals')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')

const serviceAccount = require('./node-todo-214102-firebase-adminsdk-v54vv-4c5a798729.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://node-todo-214102.firebaseio.com'
})

const fireData = admin.database()

app.engine('ejs', engine)
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  fireData.ref().once('value', function (snapshot) {
    const data = snapshot.val()
    res.render('index', { todolist: data })
  })
})
app.get('/user/:id/', function (req, res) {
  fireData.ref().once('value', function (snapshot) {
    const data = snapshot.val()
    console.log(data[req.params.id])
    res.render('user', { content: data[req.params.id] })
  })
})
app.post('/addTodo', function (req, res) {
  const title = req.body.title
  const content = req.body.content
  const time = req.body.time
  const contentRef = fireData.ref().push()
  contentRef
    .set({ title: title, content: content, time: time })
    .then(function () {
      fireData.ref().once('value', function (snapshot) {
        res.send({
          success: true,
          result: snapshot.val(),
          message: 'load successs!'
        })
      })
    })
})

app.post('/delTodo', function (req, res) {
  const _id = req.body.id
  fireData
    .ref()
    .child(_id)
    .remove()
    .then(function () {
      fireData.ref().once('value', function (snapshot) {
        res.send({
          success: true,
          result: snapshot.val(),
          message: 'delete successs!'
        })
      })
    })
})
// fireData
//   .ref()
//   .set({ title: 'YAyay' })
//   .then(function() {
//     fireData.ref().once('value', function(snapshot) {
//       console.log(snapshot.val());
//     });
//   });

const port = process.env.PORT || 3000
app.listen(port)
