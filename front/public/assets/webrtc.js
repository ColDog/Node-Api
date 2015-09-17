window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.URL = window.URL || window.mozURL || window.webkitURL;
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

/**
 * Initialization
 */
WebRTC         = {}
WebRTC.streams = []
WebRTC.config  = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]}
WebRTC.pc      = new RTCPeerConnection(WebRTC.config)
WebRTC.events  = new Evemit

/**
 * Peer connection callbacks
 */
WebRTC.pc.onaddstream = function(obj) {
    WebRTC.add(obj.stream)
}
WebRTC.pc.onicecandidate = function (e) {
    if (!e.candidate) return
    WebRTC.send("icecandidate", e.candidate)
};
WebRTC.pc.oniceconnectionstatechange = function() {
    if(WebRTC.pc.iceConnectionState == 'disconnected') {
        WebRTC.removeInactive()
    }
}
WebRTC.events.on('joinRoom', function(){ WebRTC.offer() })

/**
 * Socket Methods
 */
socket.on('offer',          function(offer)     { WebRTC.answer(offer) })
socket.on('answer',         function(offer)     { WebRTC.accept(offer) })
socket.on('icecandidate',   function(candidate) { WebRTC.pc.addIceCandidate(new RTCIceCandidate(candidate)) })
socket.on('new-user',       function(id)        { WebRTC.Users.push( id ) })

/**
 * HTML Methods
 */
WebRTC.add              = function(stream) {
    console.log('add remote')
    WebRTC.streams.push(stream)
    var div   = document.createElement('div')
    var video = document.createElement('video')
    div.className = 'mdl-card mdl-shadow--4dp'
    video.src = URL.createObjectURL(stream);
    WebRTC.pc.addStream(stream);
    video.play()
    video.setAttribute('width', '100%')
    video.setAttribute('height', '100%')
    div.setAttribute( 'id', stream.id )
    div.style.padding = 0
    div.appendChild( video )
    document.getElementById('videochat').appendChild( div )
}
WebRTC.removeInactive   = function() {
    WebRTC.streams.forEach(function(stream){
        if ( stream.ended ) {
            document.getElementById('videochat').removeChild( document.getElementById( stream.id ) )
            WebRTC.streams.splice( WebRTC.streams.indexOf( stream ), 1 )
        }
    })
}

/**
 * Utility Methods
 */
WebRTC.error  = function(err) {
    console.warn( err )
}

WebRTC.send   = function(name, offer) {
    socket.emit( name, { offer: offer, room: Engine.params('id') } )
}

/**
 * MAIN WebRTC Methods
 * Main methods that run the WebRTC functions
 * #offer is responsible for calling the initial offer to the server
 * #answer is what will answer this offer
 * #accept is what will answer the answer of the initial call
 * #media sets up the users video chat
 */
WebRTC.offer  = function()       {
    WebRTC.pc.createOffer(function(offer) {
        WebRTC.pc.setLocalDescription(new RTCSessionDescription(offer), function() {
            WebRTC.send('offer', offer)
        }, WebRTC.error);
    }, WebRTC.error);
}

WebRTC.answer = function(offer)  {
    WebRTC.pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
        WebRTC.pc.createAnswer(function(answer) {
            WebRTC.pc.setLocalDescription(new RTCSessionDescription(answer), function() {
                WebRTC.send('answer', answer)
            }, WebRTC.error);
        }, WebRTC.error);
    }, WebRTC.error);
}

WebRTC.accept = function(answer) {
    WebRTC.pc.setRemoteDescription(
        new RTCSessionDescription(answer),
        function() {  },
        WebRTC.error
    )
}

WebRTC.listen  = function() {
    navigator.getUserMedia({video: true, audio: true},
        function(stream) {
            WebRTC.pc.addStream(stream)
            WebRTC.events.emit('joinRoom')
        },
        WebRTC.error
    );
}

WebRTC.publish = function() {
    navigator.getUserMedia({video: true, audio: true},
        function(stream) {
            WebRTC.add(stream)
            WebRTC.events.emit('joinRoom')
        },
        WebRTC.error
    );
}

