/* const MongoClient = require('mongodb').MongoClient */
const { MongoClient, ObjectID } = require('mongodb')

/* var obj = new ObjectID()

console.log(obj)
 */
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoBb server', err)
    }
    console.log('Connected to MongoDB server')

    const db = client.db('TodoApp')

    db.collection('Todos').find().count().then((num) => {
        console.log('Number of todos:', num)
    }, (err) => {
        console.log("Unable to fetch todos", err)
    })

    db.collection('Todos').find({ _id: new ObjectID("5c686ce25b756db8fa5510ab")}).toArray().then((docs) => {
        console.log('Todos:', JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log("Unable to fetch todos", err)
        })
    
    db.collection('Users').find({name: 'luigi'}).toArray().then((users) => {
        console.log('Users:', JSON.stringify(users, undefined, 2))
    }, (err) => {
        console.log("Unable to fetch todos", err)
    })

    //client.close()
})