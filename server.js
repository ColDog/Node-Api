var path = require('path');
var root = path.dirname(require.main.filename);
App      = {};

function requireModel(model)            { return require(root + '/api/models/'+ model); }
function requireController(controller)  { return require(root + '/api/controllers/'+ controller); }
function requirePolicy(policy)          { return require(root + '/api/policy/'+ policy); }
function requireSocket(socket)          { return require(root + '/api/sockets/'+ socket); }

App.express         = require('express');
App.app             = App.express();
App.bodyParser      = require('body-parser');
App.http            = require('http').Server(App.app);
App.morgan          = require('morgan');
App.io              = require('socket.io')(App.http);
App.mongoose        = require('mongoose');
App.jwt             = require('jsonwebtoken');
App.EventEmitter    = require('events').EventEmitter;
App.emitter         = new App.EventEmitter();
App.redis           = require('redis').createClient(process.env.REDIS_URL ? process.env.REDIS_URL : null);

App.Controllers = {
    Chat:           requireController('Chat'),
    Home:           requireController('Home'),
    Authentication: requireController('Authentication'),
    User:           requireController('User')
};
App.Models = {
    Chat:           requireModel('Chat'),
    User:           requireModel('User')
};
App.Sockets = {
    Chat:           requireSocket('Chat')
};
App.Policy          = requirePolicy('policy');
App.routes          = require(root + '/api/routes');
App.drawRoutes      = require('./engine/routes');
App.buildSockets    = require('./engine/socket');
App.key             = require('./engine/keys');

App.app.set( 'port', (process.env.PORT || 3000) );
App.app.set( 'secret', 'ilovecoolthings' );

App.app.use(App.bodyParser.urlencoded({ extended: false }));
App.app.use(App.bodyParser.json());
App.app.use(App.morgan('dev'));
App.app.use(App.express.static('./front/public'));
App.app.use(function(req, res, next){
    req.emitter = emitter;
    next()
});

App.mongoose.connect('mongodb://localhost/chat');
App.redis.on( 'error',   function(err)  { console.log('error', err)      });
App.redis.on( 'connect', function()     { console.log('redis connected') });
App.emitter.on('invalidateCache', function(key, value){
    console.log('invalidateCache', key, value);
    App.io.emit('keys', key, value);
    App.redis.set(key, value)
});

App.drawRoutes(App.routes);
App.buildSockets();


App.http.listen(App.app.get('port'), function(){
    console.log('listening on', App.app.get('port'));
});
