const {ObjectID} = require('mongodb');

const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/Todo')
const { User } = require('../server/models/User')

/* Todo.deleteMany({}).then((res) => {
    console.log('deleteMany', res)
}) */

/* Todo.findOneAndRemove({}).then((res) => {
    console.log('findOneAndRemove', res)
}) */

/* Todo.findByIdAndRemove("5c6f04f56ef0e8064c704dd9").then((res) => {
    console.log('findByIdAndRemove', res)
}) */