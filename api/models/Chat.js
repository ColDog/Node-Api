var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var key             = require('./../../engine/keys');
var User = require( '../../engine/require' ).model('User');

var ChatSchema = new Schema({
    name:       { type: String, required: true },
    description: String,
    messages: [{author: String, message: String}],
    created_at: Date,
    updated_at: Date
});

ChatSchema.methods.user = function(cb) {
    User.findOne({_id: this.user_id}, function(err, user){
        if (err) throw err;
        cb( user )
    })
};

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
