var path = require('path');

HomeController = {
    home: function(req, res) {
        res.sendFile(path.resolve('front/views/index.html'));
    }
};

module.exports = HomeController;