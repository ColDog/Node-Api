Policy = {
    authenticate: function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            App.jwt.verify(token, app.get('secret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
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
    checkToken: function(token) {
        if (token) {
            App.jwt.verify(token, app.get('secret'), function(err, decoded) {
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