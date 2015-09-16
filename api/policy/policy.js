Policy = {
    authenticate: function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token']
        if (token) {
            jwt.verify(token, app.get('secret'), function(err, decoded) {
                if (err) {
                    console.log( 'failed to verify token' );
                    return res.json({ success: false, message: 'Failed to authenticate token.' })
                } else {
                    console.log( 'verified token' );
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    },
    correctUser: function(req, res, next) {
        if (req.params.id == req.decoded._id ) {
            console.log( 'verified correct user' );
            next()
        } else {
            return res.status(403).send({ success: false, message: 'Incorrect user signed in' });
        }
    },
    checkToken: function(token) {
        if (token) {
            jwt.verify(token, app.get('secret'), function(err, decoded) {
                if (err) {
                    return false
                } else {
                    return decoded
                }
            });
        } else {
            return false
        }
    }
};

module.exports = Policy;