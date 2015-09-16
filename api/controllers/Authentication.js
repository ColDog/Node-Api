AuthenticationController = {
    authenticate: function(req, res) {
        console.log( req.body );
        App.Models.User.findOne({ username: req.body.username }, function(err, user) {
            if (err) throw err;
            if (user) {
                user.comparePassword(req.body.password, function(err, match) {
                    if (match) {
                        var token = App.jwt.sign(user, 'ilovecoolthings', { expiresInSeconds: 86400 } ); // 24 hour expiry
                        res.json({
                            success:        true,
                            message:        'Authentication successful.',
                            data: {
                                token:          token,
                                tokenExpiry:    Date.now() + 86400000000,
                                uid:            user.id,
                                username:       user.username
                            }
                        })
                    } else {
                        res.json({ success: false, message: 'Authentication failed. Password does not match.' })
                    }
                })
            } else {
                res.json({ success: false, message: 'Authentication failed. User not found.' })
            }
        });
    }
};

module.exports = AuthenticationController;