socket.on("connect", () => {
    console.log("socket connected....");
    socket.emit("join-room", { "room_id": myRoomID });
});
socket.on("user-connect", (data) => {
    console.log("user-connect ", data);
    let peer_id = data["sid"];
    let display_name = data["name"];
    _peer_list[peer_id] = undefined; // add new user to user list
    if (!screen_share) {
        addVideoElement(peer_id, display_name);
    }
    socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "C", "state": camera_enabled });
    socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "M", "state": mic_enabled });
});
socket.on("user-disconnect", (data) => {
    console.log("user-disconnect ", data);
    let peer_id = data["sid"];

    closeConnection(peer_id);
    removeVideoElement(peer_id);
});
socket.on("user-list", (data) => {
    console.log("user list recvd ", data);
    myPeerID = data["my_id"];
    if ("list" in data) // not the first to connect to room, existing user list recieved
    {
        let recvd_list = data["list"];
        // add existing users to user list
        for (peer_id in recvd_list) {
            display_name = recvd_list[peer_id];
            _peer_list[peer_id] = undefined;
            if (!screen_share) {
                addVideoElement(peer_id, display_name);
            }
        }
        start_webrtc();
        socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "C", "state": camera_enabled });
        socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "M", "state": mic_enabled });
    }
});
socket.on("state-change", (data) => {
    if (data["sid"] != myPeerID) {
        if (data["CorM"] == "C") {
            setOtherUserVideoState(data["sid"], data["state"]);
        }
        else {
            setOtherUserAudioState(data["sid"], data["state"]);
        }
    }
});
socket.on("chat-recv", (data) => {
    console.log(`chat msg recieved`)
    addChatMsg(data["username"], data["msg"]);
});

function closeConnection(peer_id) {
    if (peer_id in _peer_list) {
        _peer_list[peer_id].onicecandidate = null;
        _peer_list[peer_id].ontrack = null;
        _peer_list[peer_id].onnegotiationneeded = null;

        delete _peer_list[peer_id]; // remove user from user list
    }
}

function log_user_list() {
    for (let key in _peer_list) {
        console.log(`${key}: ${_peer_list[key]}`);
    }
}

//---------------[ webrtc ]--------------------
var PC_CONFIG = {
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302'
            ]
        },
    ]
};

function sendViaServer(data) { socket.emit("data", data); }

socket.on("data", (msg) => {
    switch (msg["type"]) {
        case "offer":
            handleOfferMsg(msg);
            break;
        case "answer":
            handleAnswerMsg(msg);
            break;
        case "new-ice-candidate":
            handleNewICECandidateMsg(msg);
            break;
    }
});

function start_webrtc() {
    // send offer to all other members
    for (let peer_id in _peer_list) {
        invite(peer_id);
    }
}

function invite(peer_id) {
    if (_peer_list[peer_id]) { console.log("[Not supposed to happen!] Attempting to start a connection that already exists!") }
    else if (peer_id === myPeerID) { console.log("[Not supposed to happen!] Trying to connect to self!"); }
    else {
        console.log(`Creating peer connection for <${peer_id}> ...`);
        createPeerConnection(peer_id);

        let local_stream = myVideo.srcObject;
        console.log(`sending track to <${peer_id}>`)
        if (local_stream.getTracks().length == 0) {
            _peer_list[peer_id].addTransceiver("audio", { streams: [local_stream] });
            _peer_list[peer_id].addTransceiver("video", { streams: [local_stream] });
        }
        else {
            local_stream.getTracks().forEach((track) => {
                _peer_list[peer_id].addTrack(track, local_stream);
            });
        }
    }
}

function createPeerConnection(peer_id) {
    _peer_list[peer_id] = new RTCPeerConnection(PC_CONFIG);

    _peer_list[peer_id].onicecandidate = (event) => { handleICECandidateEvent(event, peer_id) };
    _peer_list[peer_id].ontrack = (event) => { handleTrackEvent(event, peer_id) };
    _peer_list[peer_id].onnegotiationneeded = () => { handleNegotiationNeededEvent(peer_id) };
}

function handleNegotiationNeededEvent(peer_id) {
    _peer_list[peer_id].createOffer()
        .then((offer) => {
            return _peer_list[peer_id].setLocalDescription(offer);
        })
        .then(() => {
            console.log(`sending offer to <${peer_id}> ...`);
            sendViaServer({
                "sender_id": myPeerID,
                "target_id": peer_id,
                "type": "offer",
                "sdp": _peer_list[peer_id].localDescription
            });
        })
        .catch(logError);
}

function handleOfferMsg(msg) {
    peer_id = msg['sender_id'];

    console.log(`offer recieved from <${peer_id}>`);

    createPeerConnection(peer_id);
    let desc = new RTCSessionDescription(msg['sdp']);
    _peer_list[peer_id].setRemoteDescription(desc)
        .then(() => {
            let local_stream = myVideo.srcObject;
            local_stream.getTracks().forEach((track) => { _peer_list[peer_id].addTrack(track, local_stream); });
        })
        .then(() => { return _peer_list[peer_id].createAnswer(); })
        .then((answer) => { return _peer_list[peer_id].setLocalDescription(answer); })
        .then(() => {
            console.log(`sending answer to <${peer_id}> ...`);
            sendViaServer({
                "sender_id": myPeerID,
                "target_id": peer_id,
                "type": "answer",
                "sdp": _peer_list[peer_id].localDescription
            });
        })
        .catch(logError);
}

function handleAnswerMsg(msg) {
    peer_id = msg['sender_id'];
    console.log(`answer recieved from <${peer_id}>`);
    let desc = new RTCSessionDescription(msg['sdp']);
    _peer_list[peer_id].setRemoteDescription(desc)
}

function handleICECandidateEvent(event, peer_id) {
    if (event.candidate) {
        sendViaServer({
            "sender_id": myPeerID,
            "target_id": peer_id,
            "type": "new-ice-candidate",
            "candidate": event.candidate
        });
    }
}

function handleNewICECandidateMsg(msg) {
    console.log(`ICE candidate recieved from <${peer_id}>`);
    var candidate = new RTCIceCandidate(msg.candidate);
    _peer_list[msg["sender_id"]].addIceCandidate(candidate)
        .catch(logError);
}

function handleTrackEvent(event, peer_id) {
    console.log(`track event recieved from <${peer_id}>`);

    if (event.streams && !screen_share) {
        getVideoObj(peer_id).srcObject = event.streams[0];
    }
}