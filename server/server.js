require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

//Object deconstruction... setting a variable from a parameter of a returned object
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

// app.post('/todos', authenticate, (req, res) => {
//     var todo = new Todo({
//         text: req.body.text,
//         _creator: req.user._id
//     });

//     todo.save().then((doc) => {
//         res.send(doc);
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });

app.post('/todos', authenticate, async(req, res) => {
    try {
        var doc = await new Todo({
            text: req.body.text,
            _creator: req.user._id
        }).save();
        res.send(doc);
    } catch (e) {
        res.status(400).send(e);
    }
});

// app.get('/todos', authenticate, (req, res) => {
//     Todo.find({
//         _creator: req.user._id
//     }).then((todos) => {
//         res.send({ todos });
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });

app.get('/todos', authenticate, async(req, res) => {

    try {
        const todos = await Todo.find({
            _creator: req.user._id
        });
        res.send({ todos });
    } catch (e) {
        res.status(400).send(e);
    }
});

// app.get('/todos/:id', authenticate, (req, res) => {
//     var id = req.params.id;

//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }

//     Todo.findOne({
//         _id: id,
//         _creator: req.user._id
//     }).then((todo) => {
//         if (!todo) {
//             return res.status(404).send();
//         }

//         res.send({ todo });
//     }).catch((e) => {
//         res.status(400).send();
//     });
// });

app.get('/todos/:id', authenticate, async(req, res) => {
    const id = req.params.id;

    try {
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    } catch (e) {
        res.status(400).send();
    }
});

// app.delete('/todos/:id', authenticate, (req, res) => {
//     var id = req.params.id;

//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }

//     Todo.findOneAndRemove({
//         _id: id,
//         _creator: req.user._id
//     }).then((todo) => {
//         if (!todo) {
//             return res.status(404).send();
//         }

//         res.send({ todo });
//     }).catch((e) => {
//         res.status(400).send();
//     });
// });

app.delete('/todos/:id', authenticate, async(req, res) => {
    const id = req.params.id;

    try {
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    } catch (e) {
        res.status(400).send();
    }
});

// app.patch('/todos/:id', authenticate, (req, res) => {
//     var id = req.params.id;
//     var body = _.pick(req.body, ['text', 'completed']);

//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }

//     if (_.isBoolean(body.completed) && body.completed) {
//         body.completedAt = new Date().getTime();
//     } else {
//         body.completed = false;
//         body.completedAt = null;
//     }

//     Todo.findOneAndUpdate({
//         _id: id,
//         _creator: req.user._id
//     }, { $set: body }, { new: true }).then((todo) => {
//         if (!todo) {
//             return res.status(404).send();
//         }

//         res.send({ todo });
//     }).catch((e) => {
//         res.status(400).send();
//     })
// });

app.patch('/todos/:id', authenticate, async(req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    try {
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, { $set: body }, { new: true });

        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    } catch (e) {
        res.status(400).send();
    }
});

// POST /users
// app.post('/users', (req, res) => {
//     var body = _.pick(req.body, ['email', 'password']);
//     var user = new User(body);

//     user.save().then(() => {
//         return user.generateAuthToken();
//     }).then((token) => {
//         res.header('x-auth', token).send(user);
//     }).catch((e) => {
//         res.status(400).send(e);
//     })
// });

app.post('/users', async(req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await new User(body).save();
        //await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// app.post('/users/login', (req, res) => {
//     var body = _.pick(req.body, ['email', 'password']);

//     User.findByCredentials(body.email, body.password).then((user) => {
//         return user.generateAuthToken().then((token) => {
//             res.header('x-auth', token).send(user);
//         });
//     }).catch((e) => {
//         res.status(400).send();
//     });
// });

app.post('/users/login', async(req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

// app.delete('/users/me/token', authenticate, (req, res) => {
//     req.user.removeToken(req.token).then(() => {
//         res.status(200).send();
//     }, () => {
//         res.status(400).send();
//     });
// });

app.delete('/users/me/token', authenticate, async(req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
    console.log(process.env);
});

module.exports = { app };