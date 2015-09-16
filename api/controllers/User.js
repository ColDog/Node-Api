UserController = {
    index: function(req, res) {
        App.Models.User.find({}, function(err, users){
            if (err) {
                res.json({ success: false, message: 'Failed to load all users.', data: err })
            } else {
                key(User, function(key){
                    res.json({ success: true, message: 'All Users.', key: key, data: users })
                });
            }
        })
    },

    show: function(req, res) {
        Models.User.findOne({ _id: req.params.id }, function(err, user){
            if (err) {
                res.json({ success: false, message: 'Failed to load user.', data: user })
            } else {
                res.json({ success: true, message: 'Loaded user.', key: user.updated_at, data: user })
            }
        })
    },

    create: function(req, res) {
        var new_user = new App.Models.User( req.body );
        new_user.save(function(err) {
            if (err) {
                res.json({ success: false,  message: 'User create failed.', data: err })
            } else {
                res.json({ success: true,   message: 'User created.', data: new_user });
                key(App.Models.User, function(cacheKey){ req.emitter.emit('invalidateCache', 'user', cacheKey ) })
            }
        });
    },

    update: function(req, res) {

    },

    destroy: function(req, res) {
        App.Models.User.remove({_id: req.body.id}, function(err){
            if (err) {
                res.json({ success: false, message: 'User failed to delete.', data: err });
            } else {
                res.json({ success: true, message: 'User deleted.'});
            }
        })

    }
};

module.exports = UserController;