var myVideo;
var audioError = false;
var videoError = false;
var camera_on_path = "../../static/images/camera-on.png";
var camera_off_path = "../../static/images/camera-off.png";
var mic_on_path = "../../static/images/mic-on.png";
var mic_off_path = "../../static/images/mic-off.png";
var share_on_path = "../../static/images/share-on.png";
var share_off_path = "../../static/images/share-off.png";
var myPeerID;
var _peer_list = {};
var selected = false;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function logError(e) { console.log(`[ERROR] ${e.name}: ${e.message}`); }

// socketio 
var protocol = window.location.protocol;
var socket = io(protocol + '//' + document.domain + ':' + location.port, { autoConnect: false });

document.addEventListener("DOMContentLoaded", (event) => {
    myVideo = document.getElementById("videoElement");
})