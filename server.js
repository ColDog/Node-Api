var path = require('path');
var root = path.dirname(require.main.filename);

function requireModel(model)            { return require(root + '/api/models/'+ model) }
function requireController(controller)  { return require(root + '/api/controllers/'+ controller) }
function requirePolicy(policy)          { return require(root + '/api/policy/'+ policy) }
function requireSocket(socket)          { return require(root + '/api/sockets/'+ socket) }

express         = require('express')
app             = express()
bodyParser      = require('body-parser')
appHttp         = require('http').Server(app)
morgan          = require('morgan')
io              = require('socket.io')(appHttp)
mongoose        = require('mongoose')
bcrypt          = require('bcrypt')
jwt             = require('jsonwebtoken')
EventEmitter    = require('events').EventEmitter
emitter         = new EventEmitter()
redis           = require('redis').createClient(process.env.REDIS_URL ? process.env.REDIS_URL : null)

Controllers = {
    Chat:           requireController('Chat'),
    Home:           requireController('Home'),
    Authentication: requireController('Authentication'),
    User:           requireController('User')
};
Models = {
    Chat:           requireModel('Chat'),
    User:           requireModel('User')
};
Sockets = {
    Chat:           requireSocket('Chat')
};

Policy          = requirePolicy('policy');
routes          = require(root + '/api/routes');
drawRoutes      = require('./engine/routes');
buildSockets    = require('./engine/socket');
key             = require('./engine/keys');

app.set( 'port', (process.env.PORT || 3000) )
app.set( 'secret', 'ilovecoolthings' )
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static('./front/public'))
app.use(function(req, res, next){
    req.emitter = emitter
    next()
});

mongoose.connect('mongodb://localhost/chat');
redis.on( 'error',   function(err)  { console.log('error', err)      })
redis.on( 'connect', function()     { console.log('redis connected') })
emitter.on('invalidateCache', function(key, value){
    redis.set(key, value)
    console.log('invalidateCache', key, value)
    io.emit('keys', key, value)
});

drawRoutes(routes);
buildSockets(io);


appHttp.listen(app.get('port'), function(){
    console.log('listening on', app.get('port'))
});
