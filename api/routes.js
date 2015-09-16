var routes = [
    { method: 'post',   url: '/authenticate',   controller: Controllers.Authentication, action: 'authenticate' },

    { method: 'get',    url: '/users',          controller: Controllers.User, action: 'index',  protect_with: Policy.authenticate  },
    { method: 'get',    url: '/users/:id',      controller: Controllers.User, action: 'show',   protect_with: Policy.authenticate  },
    { method: 'get',    url: '/users/:id',      controller: Controllers.User, action: 'update', protect_with: [Policy.authenticate, Policy.correctUser] },
    { method: 'post',   url: '/users',          controller: Controllers.User, action: 'create'  },

    { method: 'get',    url: '/chats',          controller: Controllers.Chat, action: 'index'   },
    { method: 'get',    url: '/chats/:id',      controller: Controllers.Chat, action: 'show'    },
    { method: 'post',   url: '/chats/',         controller: Controllers.Chat, action: 'create', protect_with: Policy.authenticate  },

    { method: 'get',    url: '/',               controller: Controllers.Home, action: 'home'    },
    { method: 'get',    url: '/:id',            controller: Controllers.Home, action: 'chat'    },
    { method: 'get',    url: '/profiles/:id',   controller: Controllers.Home, action: 'profile' }
];

module.exports = routes;