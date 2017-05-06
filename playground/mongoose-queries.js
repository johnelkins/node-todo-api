const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

//var id = '58f58c629b4b464c8c77e8d711';

var userId = '58f1abef2808955cf4f58f5a11';

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid');
// }

//Mongo will automatically 
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

// Query users collection
// specify email
// load user mongoose model
// User.findById
// cases user not found
// .. user was found
// .. handle errors and print to screen

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('User by Id', user);
}).catch((e) => console.log(e));