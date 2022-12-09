var protocol = window.location.protocol;
var socket = io.connect(protocol+ '//' + document.domain + ':' + location.port);
var camera_mute_checkbox = document.querySelector("#camera_mute");
var mic_mute_checkbox = document.querySelector("#mic_mute");
var camera_enabled = camera_mute_checkbox.checked;
var mic_enabled = mic_mute_checkbox.checked;
var video = document.querySelector("#videoElement");

document.addEventListener("DOMContentLoaded", (event)=>{
    // 當document被完整的讀取跟解析後就會被觸發
    startCamera();
});
camera_mute_checkbox.addEventListener('change', function() {
        camera_enabled = camera_mute_checkbox.checked;
        setVideoMuteState(camera_enabled)
});
mic_mute_checkbox.addEventListener('change', function(){
    mic_enabled = mic_mute_checkbox.checked;
    setAudioMuteState(mic_enabled);
})
function startCamera(){
  navigator.mediaDevices.getUserMedia({ video: true, audio: true})
    .then(function (stream) {
      video.srcObject = stream;
      setAudioMuteState(true);
      setVideoMuteState(true);
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
function setVideoMuteState(flag){
    // let flag = document.getElementById("camera_mute").value;
    let stream = video.srcObject;
    let track = stream.getVideoTracks();
    for(let i=0;i<track.length;i++) {
        track[i].enabled = flag;
    }
    document.querySelector("#camera_mute").enabled = flag;
}
function setAudioMuteState(flag){
    let stream = video.srcObject;
    let track = stream.getAudioTracks();
    for(let i=0;i<track.length;i++) {
        track[i].enabled = flag;
    }
    document.querySelector("#mic_mute").enabled = flag;
}
