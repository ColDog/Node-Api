module.exports = function(socket, io)  {
    socket.on('join', function(msg){
        console.log( 'join', msg )
        socket.join( msg.room )
        socket.broadcast.to( msg.room ).emit( 'new-user', socket.id )
        socket.emit('joined-room', socket.id )
    });

    socket.on('offer',  function(msg){
        console.log( 'offer', msg )
        socket.broadcast.to( msg.room ).emit( 'offer', msg.offer )
    });

    socket.on('answer', function(msg){
        console.log( 'answer', msg )
        socket.broadcast.to( msg.room ).emit( 'answer', msg.offer )
    });

    socket.on('icecandidate', function(msg){
        console.log( 'icecandidate', msg )
        socket.broadcast.to( msg.room ).emit( 'icecandidate', msg.offer )
    });

    socket.on('message', function(msg){
        console.log( 'got your message', msg )
        io.to( msg.room ).emit( 'new-message', msg.message )
        Models.Chat.findOne({_id: msg.room }, function (err, doc){
            console.log('update doc, ', err, doc)
            doc.messages.push(msg.message)
            doc.save()
            emitter.emit('invalidateCache', 'single-chat', doc._id );
        });
    });

    socket.on('disconnect', function(){
        socket.rooms.forEach(function(room){
            socket.broadcast.to( room ).emit( 'user-disconnect', socket.id )
        })
    })
};