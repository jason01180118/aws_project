var video_allowed = false;
var audio_allowed = false;

var videoConstraints = {
    video: {
        height: 360
    }
};
var audioConstraints = {
    audio: true
};

function startCamera() {
    var video_track = new MediaStream();
    navigator.mediaDevices.getUserMedia(videoConstraints)
        .then((stream) => {
            document.querySelector("#videoElement").srcObject = stream;
            video_track.addTrack(stream.getVideoTracks()[0]);
            video_allowed = true;
        })
        .catch((e) => {
            console.log("Error! Unable to access camera! ", e);
        });
    navigator.mediaDevices.getUserMedia(audioConstraints)
        .then((stream) => {
            if (video_allowed) {
                stream.addTrack(video_track.getVideoTracks()[0]);
            }
            document.querySelector("#videoElement").srcObject = stream;
            audio_allowed = true;
        })
        .catch((e) => {
            console.log("Error! Unable to access mic! ", e);
        })
        .then(() => {
            var muteAudioField = document.getElementById("mute_audio_inp");
            var muteVideoField = document.getElementById("mute_video_inp");
            var camera_mute_checkbox = document.querySelector("#camera_mute");
            var mic_mute_checkbox = document.querySelector("#mic_mute");
            camera_mute_checkbox.checked = video_allowed;
            mic_mute_checkbox.checked = audio_allowed;
            muteVideoField.value = (video_allowed) ? "1" : "0";
            muteAudioField.value = (audio_allowed) ? "1" : "0";
            if(!video_allowed) {
                document.querySelector("#camera_mute").disabled = true;
            }
            if(!audio_allowed) {
                document.querySelector("#mic_mute").disabled = true;
            }
        });
}

function setVideoMuteState(flag) {
    let stream = document.querySelector("#videoElement").srcObject;
    let track = stream.getVideoTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}

function setAudioMuteState(flag) {
    let stream = document.querySelector("#videoElement").srcObject;
    let track = stream.getAudioTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}


document.addEventListener("DOMContentLoaded", (event) => {
    // 當document被完整的讀取跟解析後就會被觸發
    var muteAudioField = document.getElementById("mute_audio_inp");
    var muteVideoField = document.getElementById("mute_video_inp");
    var camera_mute_checkbox = document.querySelector("#camera_mute");
    var mic_mute_checkbox = document.querySelector("#mic_mute");
    var camera_enabled = camera_mute_checkbox.checked;
    var mic_enabled = mic_mute_checkbox.checked;

    startCamera();
    
    camera_mute_checkbox.addEventListener('change', () => {
        camera_enabled = camera_mute_checkbox.checked;
        muteVideoField.value = (camera_enabled) ? "1" : "0";
        setVideoMuteState(camera_enabled)
    });

    mic_mute_checkbox.addEventListener('change', function () {
        mic_enabled = mic_mute_checkbox.checked;
        muteAudioField.value = (mic_enabled) ? "1" : "0";
        setAudioMuteState(mic_enabled);
    });
});