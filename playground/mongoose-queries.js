const {ObjectID} = require('mongodb');

const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('./../server/models/Todo')
const { User } = require('./../server/models/User')

var id = '5c6da7e153cfa270cfea3201'
var userID = '5c6c3f2ba77e5013b726216e'

if (!ObjectID.isValid(id)) {
    return console.log('ID not valid')
}

if (!ObjectID.isValid(userID)) {
    return console.log('userID not valid')
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos)
})

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo FindOne', todo)
})

Todo.findById(id).then((todo) => {
    if (!todo)
        console.log('id not found')
    else console.log('Todo By ID', todo)
}).catch((e) => {
    console.log(e)
})

User.findById(userID).then((user) => {
    if (!user)
        console.log('id not found')
    else console.log('User By ID', user)
}).catch((e) => {
    console.log(e)
})