const express = require('express')
// convert json to object
const bodyParser = require('body-parser')

var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/Todo')
var { User } = require('./models/User')

const app = express()

// give bodyparser middleware to express
app.use(bodyParser.json())

app.listen(3000, () => {
    console.log('started on port 3000')
})

app.post('/todos', (req, res) => {
    console.log(req.body)
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
        console.log('Unable to save todo', e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e)
    })
})

/* var newTodo = new Todo({
    text: 'Feed the cat',
    completed: true,
    completedAt: new Date().getTime()
}) */

/* newTodo.save().then((doc) => {
    console.log("Saved todo", doc)
}, (e) => {
    console.log('Unable to save todo', e)
    }) */

var user = new User({
    email: 'test@email.com'
})

/* user.save().then((res) => {
    console.log('New User saved', res)
}, (e) => {
    console.log('Unable to save new user', e)
}) */

module.exports = {app}