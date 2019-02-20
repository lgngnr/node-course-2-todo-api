const mongoose = require('mongoose')

// return a constructor
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, // remove leading and trailing space
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Number,
        default: null,
    }
})

module.exports = { Todo }