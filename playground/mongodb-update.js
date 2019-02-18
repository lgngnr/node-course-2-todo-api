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

    //findOneAndUpdate
    /* db.collection('Todos').findOneAndUpdate({
        "_id": new ObjectID("5c6ae86a134deb7b8ff7f496")
    }, {    //set mongodb operator
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result)
        }) */
    
    db.collection('Users').findOneAndUpdate({
        name: 'mario'
    }, {
            $set: {
                name: 'luigi'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result)
        })

    //client.close()
})