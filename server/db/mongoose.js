const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// module.exports = {mongoose: mongoose};
// In ES6 property and variable are the same.. no need to define
module.exports = { mongoose };