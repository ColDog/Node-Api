Require = {
    controllers: function(controllers) {
        controllers.forEach(function(controller){
            require('../api/controllers/'+ controller);
        });
    },
    models: function(models) {
        models.forEach(function(model){
            require('../api/models/'+ model);
        });
    },
    model: function(model) {
        return require('../api/models/'+ model);
    },
    controller: function(controller) {
        return require('../api/controllers/'+ controller);
    }
};

module.exports = Require;