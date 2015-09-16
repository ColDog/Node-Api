var requireHelper = require( './../engine/require' );

// Policy Documents
var policy          = require('./policy/policy');

// Controllers
var Authentication  = requireHelper.controller( 'AuthenticationController' );
var User            = requireHelper.controller( 'UserController' );
var Chat            = requireHelper.controller( 'ChatController' );
var Home            = requireHelper.controller( 'HomeController' );

// Routes
var routes = [
    // Define routes
    { method: 'post',   url: '/authenticate', controller: Authentication, action: 'authenticate' },
    { resources: '/users', controller: User },
    { resources: '/chats', controller: Chat },
    { method: 'get', url: '/',    controller: Home, action: 'home' },
    { method: 'get', url: '/:id', controller: Home, action: 'chat' }
];

module.exports = routes;