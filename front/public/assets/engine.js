/*! evemit v1.0.0 | MIT (c) 2014 Nicolas Tallefourtane - https://github.com/Nicolab/evemit */
!function(){"use strict";function t(){this.events={}}t.prototype.on=function(t,e,n){return this.events[t]||(this.events[t]=[]),n&&(e._E_ctx=n),this.events[t].push(e),this},t.prototype.once=function(t,e,n){return e._E_once=!0,this.on(t,e,n)},t.prototype.emit=function(t,e,n,s,r){var i,o,c,u;if(!this.events[t])return!1;c=Array.prototype.slice.call(arguments,1),u=c.length,o=this.events[t];for(var a=0,l=o.length;l>a;a++)switch(i=o[a],i._E_once&&this.off(t,i),u){case 0:i.call(i._E_ctx);break;case 1:i.call(i._E_ctx,e);break;case 2:i.call(i._E_ctx,e,n);break;case 3:i.call(i._E_ctx,e,n,s);break;case 4:i.call(i._E_ctx,e,n,s,r);break;default:i.apply(i._E_ctx,c)}return!0},t.prototype.off=function(t,e){if(!this.events[t])return this;for(var n=0,s=this.events[t].length;s>n;n++)this.events[t][n]===e&&(this.events[t][n]=null,delete this.events[t][n]);return this.events[t]=this.events[t].filter(function(t){return"undefined"!=typeof t}),this},t.prototype.listeners=function(t){var e,n;if(t)return this.events[t]||[];e=this.events,n=[];for(var s in e)n=n.concat(e[s].valueOf());return n},"undefined"!=typeof module&&module.exports?module.exports=t:window.Evemit=t}();

var engine = new Evemit;

Engine      = {};
Engine.E    = {};
Engine.Keys = {};
Engine.HTML = {};


Engine.authenticate = function(user) {
    console.log( user );
    $.ajax({
        url: '/authenticate',
        data: user,
        method: 'post',
        dataType: 'json',
        error: function(data) {
            engine.emit('error', data.responseJSON.message)
        },
        complete: function(data) {
            engine.emit('success', data.responseJSON.message);
            localStorage.setItem('token',       data.responseJSON.data.token);
            localStorage.setItem('tokenExpiry', data.responseJSON.data.tokenExpiry);
            localStorage.setItem('username',    data.responseJSON.data.username);
            localStorage.setItem('uid',         data.responseJSON.data.uid);
            engine.emit('authenticationComplete', data.responseJSON.message)
        }
    });
};

Engine.get = function (url, model, cb) {
    var local = localStorage.getItem(url);
    var json  = JSON.parse(local);
    if ( local && json && json.key ) {
        if (Engine.Keys[model] && Engine.Keys[model] == json.key ) {
            console.log('Engine.Keys is being used in get');
            console.log('data from get', json.data );
            cb ( json.data )
        } else {
            console.log('socket post');
            Engine.socketPost('redis', model, function(data){
                console.log('socket posted, in callback with data:', data);
                Engine.Keys[model] = data;
                if (data == json.key) {
                    console.log('socket posted now using local storage');
                    cb ( json.data )
                } else {
                    console.log('late get');
                    Engine.simpleGet(url, function(data){
                        localStorage.setItem(url, JSON.stringify(data.responseJSON));
                        cb( data.responseJSON.data )
                    });
                }
            })
        }
    } else {
        console.log('immediate get');
        Engine.simpleGet(url, function(data){
            localStorage.setItem(url, JSON.stringify(data.responseJSON));
            cb( data.responseJSON.data )
        });
    }
};

Engine.fill = function(url, model, id) {
    console.log( 'engine fill' );
    Engine.get(url, model, function( data ){
        Engine.add(id, data)
    })
};

Engine.simpleGet = function (url, cb){
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'get',
        headers: { 'x-access-token' : Engine.token },
        error: function(data) {
            engine.emit('error', data.responseJSON.message);
        },
        complete: function(data) {
            engine.emit('success', data.responseJSON.message);
            cb( data )
        }
    });
};

Engine.post = function (url, data, cb) {
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'post',
        data: data,
        headers: { 'x-access-token' : Engine.token },
        error: function(data) {
            engine.emit('error', data.jsonResponse.message)
        },
        complete: function(data) {
            engine.emit('success', data.jsonResponse.message);
            cb( data )
        }
    })
};

Engine.put = function (url, data, cb) {
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'post',
        data: data,
        headers: { 'x-access-token' : Engine.token },
        error: function(data) {
            engine.emit('error', data.jsonResponse.message)
        },
        complete: function(data) {
            engine.emit('success', data.jsonResponse.message);
            cb( data )
        }
    })
};

Engine.emit = function(bind, data) {
    socket.emit( bind,  {data: data, token: Engine.token} )
};

Engine.socketPost = function(bind, data, cb) {
    socket.emit(bind, data );
    console.log( 'socket post called' );
    socket.once(bind + 'Result', function( msg ){
        console.log( 'socket post callback', msg );
        cb( msg )
    })
};

Engine.on = function(bind, cb) {
    socket.on(bind, function( data ){
        cb( data )
    });
};

Engine.params = function(parent) {
    var arr = window.location.pathname.split('/');
    return arr[arr.indexOf(parent) + 1]
};

function htmlToAry(html){
    var string = html.clone().html();
    var elements = $(string).map(function() {
        return $('<div>').append(this).html();  // Basically `.outerHTML()`
    });
    return elements
}

function uniq(arr) {
    var i,
        len=arr.length,
        out=[],
        obj={};

    for (i=0;i<len;i++) {
        obj[arr[i]]=0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}


Engine.buildLoop = function(id, data) {
    console.log('building loop');
    var template;
    var els;
    var ary;
    if (Engine.HTML[id]) {
        template                    = Engine.HTML[id]['template'];
        ary                         = htmlToAry( $(id) );
        $(id).html(' ')
    } else {
        template                    = $(id).html();
        ary                         = [];
        Engine.HTML[id]             = {};
        Engine.HTML[id]['els']      = {};
        Engine.HTML[id]['template'] = template;
        $(id).html(' ')
    }
    var $template = $('<item />',{html:template});
    data.forEach(function(collectionItem){
        if ( Engine.HTML[id]['els'][ collectionItem['_id'] ] === true && ary.length > 1 ) {
        } else {
            var clone = $template.clone();
            $('*[item]', clone).each(function(){
                $(this).text( collectionItem[ $(this).attr('item') ] )
            });
            Engine.HTML[id]['els'][ collectionItem['_id'] ] = true;
            ary.push( clone.html() );
            console.log('adding to array', clone.html());
        }
    });
    console.log('loop ary', ary);
    $(id).append( Array.from( ary ).join(' ') )
};

Engine.addE = function(id, data) {
    $(id).text(data)
};

Engine.add = function(id, data) {
    var el = $(id);
    if ( el.attr('loop') ) {
        Engine.buildLoop(id, data)
    } else if ( el.attr('e') ) {
        Engine.addE(id, data)
    } else if ( el.attr('ev') ) {
        el.text( eval( el.attr('ev') ) )
    } else if ( el.attr('if') ) {
        Engine.if( el )
    }
};

Engine.if = function(el) {
    var id = el.attr('id');
    if (Engine.HTML[id] === undefined) {
        Engine.HTML[id]             = {};
        Engine.HTML[id]['true']     = el.find('true').html();
        Engine.HTML[id]['false']    = el.find('false').html();
        el.find('true').remove();
        el.find('false').remove();
    }

    if ( eval( el.attr( 'condition' ) ) ) {
        console.log( 'if id:', id, 'true', Engine.HTML[id]['true'] );
        el.html( Engine.HTML[id]['true'] )
    } else {
        console.log( 'if id:', id, 'false', Engine.HTML[id]['false'] );
        el.html( Engine.HTML[id]['false'] )
    }
};

Engine.draw = function(model) {
    var scope;
    if (model) {
        scope = "[model=" + model + "]"
    }
    else {
        scope = ''
    }
    console.log('draw', 'div[if]' + scope);
    $('div[if]' + scope).each(function(){
        console.log('redrawing if');
        Engine.if( $(this) )
    });

    $("*[e]" + scope).each(function(){
        $(this).text( Engine.E[ $(this).attr('e') ] )
    });

    $("*[ev]" + scope).each(function(){
        $(this).text( eval( $(this).attr('ev') ) )
    });
};


Engine.sendLocation = function(){
    $.ajax({
        url:        '//freegeoip.net/json/',
        type:       'post',
        dataType:   'jsonp',
        success: function(data){
            Engine.emit('location', {
                country:    data.country_name,
                city:       data.city,
                ip:         data.ip
            })
        }
    });
};


socket.on('keys', function( key, value ){
    Engine.Keys[key] = value;
    console.log('cache invalidated', key, value);
    engine.emit(key + '-cache-invalidated', value);
});

Engine.on('connect', function() {
    console.log('websocket connection established')
});

engine.on('data-update', function(data){
    engine.emit(data + '-data-update', 'updated data');
    console.log('redraw due to data update');
    Engine.draw(data)
});

$(document).ready(function(){
    Engine.draw();
    //Engine.sendLocation()
});
