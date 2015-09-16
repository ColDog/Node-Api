module.exports = function(){
    App.io.on('connection', function(socket){
        console.log('socket connected');

        socket.on('location', function(msg){
            console.log('location', msg)
        });

        socket.on('redis',function(key){
            App.redis.get(key, function(err, reply) {
                console.log('redis', key, err, reply);
                socket.emit('redisResult', reply)
            });
        });

        App.Sockets.Chat(socket)

    });
};