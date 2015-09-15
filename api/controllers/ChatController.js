var Chat = require( '../../engine/require' ).model('Chat');
var key  = require( '../../engine/keys');

ChatController = {
    index: function(req, res) {
        Chat.find({}, function(err, chats){
            if (err) {
                res.json({ success: false, message: 'Failed to load all chats.', data: chats })
            } else {
                key(Chat, function(key){
                    res.json({ success: true, message: 'All Chats.', key: key, data: chats })
                });
            }
        })
    },

    create: function(req, res) {
        var new_chat = new Chat( req.body );
        new_chat.save(function(err) {
            if (err) {
                res.json({ success: false,  message: 'Chat create failed.', data: err })
            } else {
                res.json({ success: true,   message: 'Chat created.', data: new_chat });
                key(Chat, function(cacheKey){ req.emitter.emit('invalidateCache', 'chat', cacheKey ) })
            }
        });
    },

    destroy: function(req, res) {
        Chat.remove({_id: req.body.id}, function(err){
            if (err) {
                res.json({ success: false, message: 'Chat failed to delete.', data: err });
            } else {
                res.json({ success: true, message: 'Chat deleted.'});
            }
        })

    }
};

module.exports = ChatController;