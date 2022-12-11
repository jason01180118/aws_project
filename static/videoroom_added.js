var media_allowed = true;
var audioError = false;
var videoError = false;

function startCamera() {
    var mediaConstraints = {
        audio: true,
        video: {
            height: 360
        }
    };
    var videoConstraints = {
        video: {
            height: 360
        }
    };
    var audioConstraints = {
        audio: true
    };
    const promiseMedia = navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then((stream) => {
            document.querySelector("#videoElement").srcObject = stream;
        })
        .catch((e) => {
            if (e.name == "NotReadableError") {
                const promiseAudio = navigator.mediaDevices.getUserMedia(audioConstraints)
                    .then((stream) => {
                        document.querySelector("#videoElement").srcObject = stream;
                    })
                    .catch((e) => {
                        audioError = true;
                        console.log(e.name, e.message);
                    });
                const promiseVideo = navigator.mediaDevices.getUserMedia(videoConstraints)
                    .then((stream) => {
                        document.querySelector("#videoElement").srcObject = stream;
                    })
                    .catch((e) => {
                        videoError = true;
                        console.log(e.name, e.message);
                    });
                return Promise.allSettled([promiseAudio, promiseVideo]);
            }
            else if (e.name == "NotAllowedError") {
                media_allowed = false;
                audioError = true;
                videoError = true;
                console.log(e.name, e.message);
            }
            else {
                console.log(e.name, e.message);
            }
        })
        .then(() => {
            if (audioError) {
                document.querySelector("#mic_mute").checked = false;
                document.getElementById("audio_enabled_inp").value = false;
            }
            if (videoError) {
                document.querySelector("#camera_mute").checked = false;
                document.getElementById("video_enabled_inp").value = false;
            }
        });
    return Promise.allSettled([promiseMedia]);
}

function setVideoState(flag) {
    let stream = document.querySelector("#videoElement").srcObject;
    let track = stream.getVideoTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}

function setAudioState(flag) {
    let stream = document.querySelector("#videoElement").srcObject;
    let track = stream.getAudioTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}


document.addEventListener("DOMContentLoaded", (event) => {
    // 當document被完整的讀取跟解析後就會被觸發
    var audioEnabledField = document.getElementById("audio_enabled_inp");
    var videoEnabledField = document.getElementById("video_enabled_inp");
    var camera_mute_checkbox = document.querySelector("#camera_mute");
    var mic_mute_checkbox = document.querySelector("#mic_mute");
    var camera_enabled = camera_mute_checkbox.checked;
    var mic_enabled = mic_mute_checkbox.checked;

    startCamera();

    camera_mute_checkbox.addEventListener('change', () => {
        if (!videoError) {
            camera_enabled = camera_mute_checkbox.checked;
            videoEnabledField.value = (camera_enabled) ? "1" : "0";
            setVideoState(camera_enabled);
        }
        else {
            camera_mute_checkbox.checked = false;
            alert("Error! Your camera can not be accessed!");
        }
    });

    mic_mute_checkbox.addEventListener('change', () => {
        if (!audioError) {
            mic_enabled = mic_mute_checkbox.checked;
            audioEnabledField.value = (mic_enabled) ? "1" : "0";
            setAudioState(mic_enabled);
        }
        else {
            mic_mute_checkbox.checked = false;
            alert("Error! Your mic can not be accessed!");
        }
    });
});