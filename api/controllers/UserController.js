var User = require( '../../engine/require' ).model('User');
var key  = require( '../../engine/keys');

UserController = {
    index: function(req, res) {
        User.find({}, function(err, users){
            if (err) {
                res.json({ success: false, message: 'Failed to load all users.', data: err })
            } else {
                key(User, function(key){
                    res.json({ success: true, message: 'All Users.', key: key, data: users })
                });
            }
        })
    },

    new: function(req, res) {
        res.send('Hello');
    },

    edit: function(req, res) {
        res.send('Hello');
    },

    create: function(req, res) {
        var new_user = new User( req.body );
        new_user.save(function(err) {
            if (err) {
                res.json({ success: false,  message: 'User create failed.', data: err })
            } else {
                res.json({ success: true,   message: 'User created.', data: new_user });
                key(User, function(cacheKey){ req.emitter.emit('invalidateCache', 'user', cacheKey ) })
            }
        });
    },

    update: function(req, res) {

    },

    destroy: function(req, res) {

    }
};

module.exports = UserController;