const mongoose = require('mongoose');
const validator = require('validator');

// {
//     email: 'theinternot@gmail.com',
//     password: '123abc',
//     tokens: [{
//         access: 'auth',
//         token: 'alsdjfalksfalskdfj'
//     }]
// }

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmal,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    tokens: [{
        access: {

        },
        tokens: {

        }
    }]
});

module.exports = { User };