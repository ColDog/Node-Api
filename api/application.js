var requireHelper = require( './../engine/require' );

// Policy Documents
var policy          = require('./policy/policy');

// Controllers
var Authentication  = requireHelper.controller( 'AuthenticationController' );
var User            = requireHelper.controller( 'UserController' );
var Home            = requireHelper.controller( 'HomeController' );

// Routes
var routes = [
    // Define routes
    { method: 'get',    url: '/', controller: Home, action: 'home' },
    { method: 'post',   url: '/authenticate', controller: Authentication, action: 'authenticate' },
    { resources: '/users', controller: User }
];

module.exports = routes;