module.exports = function(socket)  {
    socket.on('join', function(room){
        console.log( 'join', room.data );
        socket.join( room.data );
    });
    socket.on('message', function(msg){
        console.log( 'got your message', msg );
        io.to( msg.data.room ).emit( 'new-message', msg.data.message );
        Models.Chat.findOne({_id: msg.data.room }, function (err, doc){
            console.log('update doc, ', err, doc);
            doc.messages.push(msg.data.message);
            doc.save();
            emitter.emit('invalidateCache', 'single-chat', doc._id );
        });
    })
};