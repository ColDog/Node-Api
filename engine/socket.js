module.exports = function(){
    io.on('connection', function(socket){
        console.log('socket connected')

        socket.on('location', function(msg){
            console.log('location', msg)
        });

        socket.on('redis',function(key){
            redis.get(key, function(err, reply) {
                console.log('redis', key, err, reply)
                socket.emit('redisResult', reply)
            });
        });

        Sockets.Chat(socket)

    });
};