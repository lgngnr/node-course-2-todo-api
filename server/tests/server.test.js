const request = require('supertest')
const expect = require('expect')

const { ObjectID } = require('mongodb');

const { app } = require('../server')
const { Todo } = require('../models/Todo')

const todos = [
    { _id: new ObjectID(), text: 'Code 2' },
    { _id: new ObjectID(), text: 'Code 3', completed: true, completedAt: 123 }]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos)
    }).then(() => {
        done()
    })
})

describe('POST /todos', () => {
    it('should create a new Todo', (done) => {
        var text = 'Code 1'
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3)
                    expect(todos[2].text).toBe(text)
                    done()
                }).catch((e) => {
                    done(e)
                })
            })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => {
                    done(e)
                })
            })
    })

    describe('GET /todos', () => {
        it('should get all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2)
                })
                .end(done)
        })
    })

    describe('GET /todos:id', () => {
        it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect((res) => {
                        expect(res.body.todo.text).toBe(todos[0].text)
                    })
                })
                .end(done)
        })

        it('should return 404 if todo not found', (done) => {
            request(app)
                .get(`/todos/${new ObjectID().toHexString()}`)
                .expect(404)
                .end(done)
        })

        it('should return 404 if invalid id', (done) => {
            request(app)
                .get(`/todos/123`)
                .expect(404)
                .end(done)
        })

    })

})

describe('DELETE /todos/:id', () => {
    var hexId = todos[1]._id.toHexString()
    it('should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexId).then((todo) => {
                    console.log('deleted', todo)
                    expect(todo).toNotExist()
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done)
    })

    it('should return a 404 if ObjectID invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done)
    })
});

describe('PATCH /todos/:id', () => {
    var hexId = todos[0]._id.toHexString()
    var text = 'New test'
    it('should update a todo', (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeAn('number')
            })
            .end(done)
    })

    it('should clear completedAt when todo is not complete', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id}`)
            .send({ text, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
    })
});