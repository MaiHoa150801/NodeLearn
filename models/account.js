var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');

var AccountSchema = new Schema({
    username: {type: String},
    password: {type: String},
});

AccountSchema.plugin(passportLocalMongooseEmail, {
    usernameField: 'email',
});

module.exports = mongoose.model('Account', AccountSchema);