var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var http            = require('http').Server(app);
var morgan          = require('morgan');
var io              = require('socket.io')(http);
var mongoose        = require('mongoose');
var config          = require('./config/config');
var requireHelper   = require( './engine/require' );
var routesHelper    = require( './engine/routes' );
var jwt             = require('jsonwebtoken');
var EventEmitter    = require('events').EventEmitter;
var emitter         = new EventEmitter();
var redis           = require('redis').createClient(process.env.REDIS_URL ? process.env.REDIS_URL : null);

app.set( 'port', (process.env.PORT || 3000) );
app.set( 'secret', config.secret );



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('./front/public'));
app.use(function(req, res, next){
    req.emitter = emitter;
    next()
});

mongoose.connect('mongodb://localhost/chat');
redis.on( 'error',   function(err)  { console.log('error', err)      });
redis.on( 'connect', function()     { console.log('redis connected') });

requireHelper.models( config.models );
requireHelper.controllers( config.controllers );
routesHelper( app, require( './api/application' ) );

require('./engine/socket')( app, io, redis, emitter );

emitter.on('invalidateCache', function(key, value){
    console.log('invalidateCache', key, value);
    io.emit('keys', key, value);
    redis.set(key, value)
});

http.listen(app.get('port'), function(){
    console.log('listening on', app.get('port'));
});
