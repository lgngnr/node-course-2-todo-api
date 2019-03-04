const request = require('supertest')
const expect = require('expect')

const { ObjectID } = require('mongodb');

const { app } = require('../server')
const { Todo } = require('../models/Todo')
const { User } = require('../models/User')
const { todos, populateTodos, users, populateUser } = require('../tests/seed/seed')

beforeEach(populateUser)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new Todo', (done) => {
        var text = 'Code 1'
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(1)
                })
                .end(done)
        })
    })

    describe('GET /todos:id', () => {
        it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect((res) => {
                        expect(res.body.todo.text).toBe(todos[0].text)
                    })
                })
                .end(done)
        });

        it('should return 404 if todo not found', (done) => {
            request(app)
                .get(`/todos/${new ObjectID().toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done)
        });

        it('should return 404 if invalid id', (done) => {
            request(app)
                .get(`/todos/123`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done)
        });

        it('should not return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[1]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done)
        });
    });
});

describe('DELETE /todos/:id', () => {
    var hexId = todos[1]._id.toHexString()
    it('should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return a 404 if ObjectID invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should not remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexId).then((todo) => {
                    console.log('deleted', todo)
                    expect(todo).toExist()
                    done()
                }).catch((err) => {
                    done(err)
                })
            });
    });
});

describe('PATCH /todos/:id', () => {
    var hexId = todos[0]._id.toHexString()
    var text = 'New test'
    it('should update a todo', (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[1].tokens[0].token)
            .send({ text, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
    })

    it('should not update a todo', (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ text, completed: true })
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => { 
    it('should return user if athenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return a 401 if not athenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    })
});

describe('POST /users', () => {
    it('should return a user', (done) => {
        var email = 'example@example.com'
        var password = '123abc!'
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist()
                expect(res.body._id).toExist()
                expect(res.body.email).toBe(email)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.findOne({ email }).then((user) => {
                    expect(user).toExist()
                    expect(user.password).toNotBe(password)
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({ email: '', password: '' })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        var email = 'test1@email.com'
        var password = ''
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(400)
            .end(done);
    });

})

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist()
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: '123'
            })
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toNotExist()
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    })
});

describe('DELETE /users/me/token', () => {
    it('it should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    });
});