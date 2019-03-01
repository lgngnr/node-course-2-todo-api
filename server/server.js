const env = require('./config/config')
const express = require('express')
// convert json to object
const bodyParser = require('body-parser')
const _ = require('lodash')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/Todo')
const { User } = require('./models/User')
var { authenticate } = require('./middleware/authenticate')

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
        return res.status(404).send({ res: "invalid" })
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

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo)
            return res.status(404).send()
        res.send({ todo })
    }).catch((e) => {
        res.status(400).send()
    })
});

app.post('/users', (req, res) => {
    var userFields = _.pick(req.body, ['email', 'password'])

    var user = new User(userFields)

    user.save()
        .then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send(user)
        }).catch((e) => {
            res.status(400).send(e)
        })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
});

app.post('/users/login', (req, res) => {
    var userFields = _.pick(req.body, ['email', 'password'])
    User.findByCredentials(userFields.email, userFields.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user)
        })
        
    }).catch((e) => {
        console.log(e)
        res.status(400).send({})
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

module.exports = { app }