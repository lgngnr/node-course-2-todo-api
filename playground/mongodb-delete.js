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

    //deleteMany
    /* db.collection('Todos').deleteMany({ text: 'Eat lunch' })
        .then((result) => {
            console.log(result)
        }) */

    //deleteOne
    /* db.collection('Todos').deleteOne({text: 'Eat lunch'}) 
        .then((result) => {
            console.log(result.result)
        }) */

    //findOneAndDelete
    /* db.collection('Todos').findOneAndDelete({ completed: false })
        .then((result) => {
            console.log(result)
        }) */
    
    //deletemany Users
    /* db.collection('Users').deleteMany({ name: 'luigi' })
        .then((result) => {
            console.log(result.result)
        } )*/
    // deleteOne by ID

    db.collection('Users').deleteOne({ _id: new ObjectID("5c6ae70c134deb7b8ff7f44b") })
        .then((result) => {
            console.log(result.result)
        })

    //client.close()
})