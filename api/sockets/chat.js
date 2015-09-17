var chatMembers = []

module.exports = function(socket, io)  {
    socket.on('join', function(msg){
        socket.join( msg.room )
        socket.broadcast.to( msg.room ).emit( 'new-user', socket.id )
        chatMembers.push( socket.id )
        socket.emit('joined-room', { userId: socket.id, members: chatMembers  } )
    });

    socket.on('offer',  function(msg){
        io.to( msg.to ).emit( 'offer', { offer: msg.offer, by: msg.by } )
    });

    socket.on('answer', function(msg){
        io.to( msg.to ).emit( 'answer', { offer: msg.offer, by: msg.by }  )
    });

    socket.on('icecandidate', function(msg){
        io.to( msg.to ).emit( 'icecandidate', { offer: msg.offer, by: msg.by }  )
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
        if (chatMembers.indexOf(socket.id) > -1) chatMembers.splice( chatMembers.indexOf(socket.id), 1 )
    })
};