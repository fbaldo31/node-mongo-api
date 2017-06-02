var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    userName: String,
    password: String,
    avatar: String,
    createdAt: Date,
    deletedAt: Date
});

var User = mongoose.model('User', userSchema);

module.exports = User;