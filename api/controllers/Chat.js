ChatController = {
    index: function(req, res) {
        Models.Chat.find({}, function(err, chats){
            if (err) {
                res.json({ success: false, message: 'Failed to load all chats.', data: chats })
            } else {
                key(Models.Chat, function(key){
                    res.json({ success: true, message: 'All Chats.', key: key, data: chats })
                });
            }
        })
    },

    show: function(req, res) {
        Models.Chat.findOne({ _id: req.params.id }, function(err, chats){
            if (err) {
                res.json({ success: false, message: 'Failed to load chat.', data: chats })
            } else {
                res.json({ success: true, message: 'Loaded chat.', key: chats.messages[ chats.length - 1 ], data: chats })
            }
        })
    },

    create: function(req, res) {
        var new_chat = new Models.Chat( req.body );
        new_chat.save(function(err) {
            if (err) {
                res.json({ success: false,  message: 'Chat create failed.', data: err })
            } else {
                res.json({ success: true,   message: 'Chat created.', data: new_chat });
                key(Models.Chat, function(cacheKey){ req.emitter.emit('invalidateCache', 'chat', cacheKey ) })
            }
        });
    },

    destroy: function(req, res) {
        Models.Chat.remove({_id: req.body.id}, function(err){
            if (err) {
                res.json({ success: false, message: 'Chat failed to delete.', data: err });
            } else {
                res.json({ success: true, message: 'Chat deleted.'});
            }
        })

    }
};

module.exports = ChatController;