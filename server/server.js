require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

//Object deconstruction... setting a variable from a parameter of a returned object
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

// resource creation using POST
app.post('/todos', (req, res) => {
    todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET /todos/12345
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(200).send({ todo }); //respond with todo properties object ES6
    }).catch((e) => res.status(404).send());
    //Validate id using isValid
    //404 - send back empty body

    //findById
    // success case
    // if todo, send back
    // if not todo - send back 404 with empty body
    // error case
    // send back 400 - do not send error message empty body back


});

app.delete('/todos/:id', (req, res) => {
    //GET ID
    //validate ID -> not valid return 404
    // remove todo by id

    //success
    //if no doc, send 404 - check for null though
    //if doc, send 200
    //error
    // 400 w/ empty body
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo || todo === null) {
            res.status(404).send();
        }
        res.status(200).send({ todo }); //respond with todo properties object ES6
    }).catch((e) => res.status(404).send());

});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //use lodash to pick off properties from body

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

// POST /users 
// use _.pick
//

app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']); //use lodash to pick off properties from body

    user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };