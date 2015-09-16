var path = require('path');

HomeController = {
    home: function(req, res) {
        res.sendFile(path.resolve('front/views/index.html'));
    },
    chat: function(req, res) {
        res.sendFile(path.resolve('front/views/chat.html'));
    },
    profile: function(req, res) {
        res.sendFile(path.resolve('front/views/profile.html'));
    }
};

module.exports = HomeController;