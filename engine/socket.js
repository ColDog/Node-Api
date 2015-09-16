var chat = require('../api/sockets/chat');

module.exports = function(app, io, redis, emitter){
    io.on('connection', function(socket){
        console.log('socket connected');

        socket.on('location', function(msg){
            console.log('location', msg)
        });

        socket.on('redis',function(key){
            redis.get(key, function(err, reply) {
                console.log('redis', key, err, reply);
                socket.emit('redisResult', reply)
            });
        });

        chat(app, io, redis, socket, emitter)

    });
};