function flash(message) {
    $('#flash').text(message);
    $('#flash').slideDown(function() {
        setTimeout(function() {
            $('#flash').slideUp();
        }, 3000);
    });
}

function initialize() {
    engine.on('error',   function(message)  { flash(message); console.log(message) });
    engine.on('success', function(message)  { flash(message); console.log(message) });
    engine.on('alert',   function(message)  { flash(message); console.log(message) });
    Engine.on('alert',   function(message)  { flash(message); console.log(message) });
    Engine.on('error',   function(message)  { flash(message); console.log(message) });
    Engine.on('success', function(message)  { flash(message); console.log(message) });

    $('#authForm').submit(function (event) {
        event.preventDefault();
        Engine.authenticate('#authForm')
    })
}

User = {
    uid:            function() { return localStorage.getItem('uid') },
    token:          function() { return localStorage.getItem('token') },
    tokenExpiry:    function() { return localStorage.getItem('tokenExpiry') },
    username:       function() { return localStorage.getItem('username') },
    logout: function() {
        localStorage.setItem('token',       null);
        localStorage.setItem('tokenExpiry', null);
        localStorage.setItem('username',    null);
        localStorage.setItem('uid',         null);
    }
};

function toDate(str) {
    return new Date(parseInt(str))
}

function current_user() {
    if (User.token() && User.tokenExpiry() && toDate(User.tokenExpiry()) > Date.now() ) {
        return {
            token:  User.token(),
            name:   User.username(),
            uid:    User.uid()
        }
    } else {
        return false
    }
}

initialize();

$( document ).ready(function(){
    initialize();
});