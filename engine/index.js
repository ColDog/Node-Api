function requireModel(model) {
    return require('../api/models/'+ model);
}
function requireController(controller) {
    return require('../api/controllers/'+ controller);
}

App = {
    Controllers: {
        Chat:           requireController('Chat'),
        Home:           requireController('Home'),
        Authentication: requireController('Authentication'),
        User:           requireController('User')
    }
};

module.exports = App;