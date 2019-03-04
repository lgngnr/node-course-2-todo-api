const { ObjectID } = require('mongodb')
const { Todo } = require('../../models/Todo')
const { User } = require('../../models/User')
const jwt = require('jsonwebtoken')


const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const users = [
    {
        _id: userOneId,
        email: 'test1@email.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'test2@email.com',
        password: 'userTwoPass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
        }]
    }
]

const todos = [
    {
        _id: new ObjectID(),
        text: 'Code 2',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'Code 3',
        completed: true,
        completedAt: 123,
        _creator: userTwoId
    }
]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos)
    }).then(() => {
        done()
    });
};

const populateUser = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
                // wait all promises resolved
        return Promise.all([userOne, userTwo])
    }).then(()=>done());
};

module.exports = { todos, populateTodos, users, populateUser };