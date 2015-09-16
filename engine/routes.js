module.exports = function(routes){
    function mapRoutes(routes) {
        routes.forEach(function(route){
            console.log(route.method, route.url || route.resources);
            if (route.resources) {
                var resource = [
                    { method: 'get',    url: route.resources,               controller: route.controller, action: 'index',      protect_with: route.protect_with },
                    { method: 'get',    url: route.resources + '/:id',      controller: route.controller, action: 'show',       protect_with: route.protect_with },
                    { method: 'post',   url: route.resources,               controller: route.controller, action: 'create',     protect_with: route.protect_with },
                    { method: 'put',    url: route.resources + '/:id',      controller: route.controller, action: 'update',     protect_with: route.protect_with },
                    { method: 'delete', url: route.resources + '/:id',      controller: route.controller, action: 'destroy',    protect_with: route.protect_with }
                ];
                mapRoutes(resource)
            } else {
                if (route.protect_with) {
                    app[ route.method ](route.url, route.protect_with, function(req, res, next){
                        route.controller[ route.action ](req, res)
                    })
                } else {
                    app[ route.method ](route.url, function(req, res){
                        route.controller[ route.action ](req, res)
                    })
                }
            }
        })
    }
    mapRoutes(routes)
};