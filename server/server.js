const env = require('./config/config')

const express = require('express')
// convert json to object
const bodyParser = require('body-parser')
const _ = require('lodash')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/Todo')
const { User } = require('./models/User')

const app = express()

const port = process.env.PORT

// give bodyparser middleware to express
app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`started on port ${port}`)
})

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
        //console.log('Unable to save todo', e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id
    //console.log('requested id', id)
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({})
    } 
        
    Todo.findById(id).then((todo) => {
        //console.log('todo',todo)
        if (todo)
            res.send(todo)
        else
            res.status(404).send({})
    }).catch((e) => {
        //console.log(e)
        res.status(400).send({})
    })
})

app.delete('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send({res: "invalid"})
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if (!todo) {
            res.status(404).send({})
        } else {
            res.send({ todo })
        }
    }).catch((e) => {
        res.status(400).send({})
    })
})

// update todo items
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id))
        return res.status(404).send({ res: "invalid" })
    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo)
            return res.status(404).send()
        res.send({todo})
    }).catch((e) => {
        res.status(400).send()
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