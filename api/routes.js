var routes = [
    { method: 'post',   url: '/authenticate', controller: App.Controllers.Authentication, action: 'authenticate' },
    { resources: '/users', controller: App.Controllers.User },
    { resources: '/chats', controller: App.Controllers.Chat },
    { method: 'get', url: '/',    controller: App.Controllers.Home, action: 'home' },
    { method: 'get', url: '/:id', controller: App.Controllers.Home, action: 'chat' }
];

module.exports = routes;