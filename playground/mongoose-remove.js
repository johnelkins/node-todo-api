const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}) - can't pass in empty argument
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({ _id: '58f6dc198bd1c7f24fc64bc1' }).then((todo) => {
    console.log(result);
});

Todo.findByIdAndRemove('58f6dc198bd1c7f24fc64bc1').then((todo) => {
    console.log(todo);
});