var protocol = window.location.protocol;
var camera_mute_checkbox;
var mic_mute_checkbox;
var camera_enabled;
var mic_enabled;
var video;
document.addEventListener("DOMContentLoaded", (event) => {
    // 當document被完整的讀取跟解析後就會被觸發
    camera_mute_checkbox = document.querySelector("#camera_mute");
    mic_mute_checkbox = document.querySelector("#mic_mute");
    camera_enabled = camera_mute_checkbox.checked;
    mic_enabled = mic_mute_checkbox.checked;
    video = document.querySelector("#videoElement");

    startCamera();
    camera_mute_checkbox.addEventListener('change', function () {
        camera_enabled = camera_mute_checkbox.checked;
        setVideoMuteState(camera_enabled)
    });
    mic_mute_checkbox.addEventListener('change', function () {
        mic_enabled = mic_mute_checkbox.checked;
        setAudioMuteState(mic_enabled);
    })
});

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
}
function setVideoMuteState(flag) {
    // let flag = document.getElementById("camera_mute").value;
    let stream = video.srcObject;
    let track = stream.getVideoTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}
function setAudioMuteState(flag) {
    let stream = video.srcObject;
    let track = stream.getAudioTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}
