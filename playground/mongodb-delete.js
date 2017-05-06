// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({ text: 'Something to do' }).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({ text: 'Fuck off' }).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    // });

    //deleteMany
    // db.collection('Users').deleteMany({ name: 'John Elkins' }).then((result) => {
    //     console.log(result);
    // }); 

    //findOneAndDelete
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('58f1793966bba44fe87c3eb3')
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});