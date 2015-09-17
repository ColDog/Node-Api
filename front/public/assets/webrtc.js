window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.URL = window.URL || window.mozURL || window.webkitURL;
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

/************ Initialization ************/
WebRTC              = {}
WebRTC.userStream   = null
WebRTC.userId       = null
WebRTC.config       = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]}
WebRTC.events       = new Evemit
WebRTC.users        = []
peerC               = {}

WebRTC.events.on('ready', function(){
    WebRTC.sendOffers()
})

/************ Peer Connection ************
 This method is designed to be called to connect with an ID for a peer connection. When a user first
 Joins a room, they walk through and send offers to all members. Then establishing peer connections
 with each, represented by an ID assigned by socket.io. It is always the responsibility of the joining
 user to send offers to those already in the room.
 */
WebRTC.getPc = function(id) {
    if (peerC[id]) {
        return peerC[id]
    } else {
        var pc = new RTCPeerConnection(WebRTC.config)
        peerC[id] = pc

        pc.addStream(WebRTC.userStream)

        pc.onaddstream = function(obj) {
            console.log('add stream', id)
            WebRTC.add(obj.stream, id)
        }
        pc.onicecandidate = function (e) {
            console.log('ice candidates', id)
            WebRTC.send("icecandidate", e.candidate, id)
        }
        return pc
    }
}

/************ Sockets ************
 The sockets relay the key application information from the server:
 - When an offer comes in, an answer is sent out
 - When an answer comes in, it is accepted
 - When an `icecandidate` comes in, it is added
 - When a new user joins, nothing happens, but an alert is relayed
 - When a user first joins the room, they connect to all the users in the current room, sending out offers
*/
socket.on('offer',          function(msg)       { WebRTC.answer(msg.by, msg.offer) })
socket.on('answer',         function(msg)       { WebRTC.accept(msg.by, msg.offer) })
socket.on('icecandidate',   function(candidate) { WebRTC.pc.addIceCandidate(new RTCIceCandidate(candidate)) })
socket.on('new-user',       function()          { engine.emit('success', 'new user connected') })
socket.on('joined-room',    function(msg)       { WebRTC.userId = msg.userId ; WebRTC.users = msg.members })


/************ Get initialization information ************/
WebRTC.sendOffers = function() {
    console.log(WebRTC.unconn)
    WebRTC.unconn.forEach(function(id){
        if (id === WebRTC.userId) {
            removeAry(WebRTC.unconn, id)
        } else {
            removeAry(WebRTC.unconn, id)
            WebRTC.offer(id)
        }
    })
}

WebRTC.publish = function() {
    navigator.getUserMedia({video: true, audio: true},
        function(stream) {
            WebRTC.userStream = stream
            WebRTC.add(stream)
            WebRTC.events.emit('ready')
        },
        WebRTC.error
    );
}

/************ Main Offer and Answer Methods ************/
WebRTC.offer  = function(id) {
    console.log('offer', id)
    var pc = WebRTC.getPc(id)
    pc.createOffer(function(offer) {
        pc.setLocalDescription(new RTCSessionDescription(offer), function() {
            WebRTC.send('offer', offer, id)
        }, WebRTC.error);
    }, WebRTC.error);
}

WebRTC.answer = function(id, offer) {
    console.log('answer', id)
    var pc = WebRTC.getPc(id)
    pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
        pc.createAnswer(function(answer) {
            pc.setLocalDescription(new RTCSessionDescription(answer), function() {
                WebRTC.send('answer', answer, id)
            }, WebRTC.error);
        }, WebRTC.error);
    }, WebRTC.error);
}

WebRTC.accept = function(id, answer) {
    console.log('accept', id)
    var pc = WebRTC.getPc(id)
    pc.setRemoteDescription(
        new RTCSessionDescription(answer),
        function() { console.log('accept successful') },
        WebRTC.error
    )
}

/************ HTML and Utility Methods ************/
WebRTC.add    = function(stream, id) {
    console.log('add remote')
    var div   = document.createElement('div')
    var video = document.createElement('video')
    div.className = 'mdl-card mdl-shadow--4dp'
    video.src = URL.createObjectURL(stream);
    video.play()
    video.setAttribute('width', '100%')
    video.setAttribute('height', '100%')
    video.setAttribute('controls', '')
    div.setAttribute( 'id', id )
    div.style.padding = 0
    div.appendChild( video )
    document.getElementById('videochat').appendChild( div )
}
WebRTC.remove = function(id) {
    document.getElementById('videochat').removeChild( document.getElementById( id ) )
}
WebRTC.error  = function(err) {
    console.warn( err )
}
WebRTC.send   = function(name, offer, to) {
    socket.emit( name, { offer: offer, room: Engine.params('id'), by: WebRTC.userId, to: to } )
}

