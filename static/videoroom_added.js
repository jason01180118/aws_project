var media_allowed = true;
var audioError = false;
var videoError = false;
var mic_enabled = true;
var camera_enabled = true;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
                mic_enabled = false;
                document.querySelector("#mic_mute").src = "../../static/images/mic-off.png";
                document.getElementById("audio_enabled_inp").value = false;
            }
            if (videoError) {
                camera_enabled = false;
                document.querySelector("#camera_mute").src = "../../static/images/camera-off.png";
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
    var camera_image = document.querySelector("#camera_mute");
    var mic_image = document.querySelector("#mic_mute");
    var my_video_mask_path = `../../static/images/video_mask${getRandomIntInclusive(0, 4)}.png`;

    document.getElementById("video_mask").children[0].src = my_video_mask_path;

    startCamera();

    let input_box = document.getElementsByClassName("input_box")[0];
    input_box.addEventListener("input", () => {
        if(input_box.validity.patternMismatch) {
            input_box.setCustomValidity("輸入只能是中文、英文或數字");
        } else {
            input_box.setCustomValidity("");
        }
    });

    camera_image.addEventListener('click', () => {
        if (!videoError) {
            camera_enabled = !camera_enabled;
            camera_image.src = (camera_enabled) ? "../../static/images/camera-on.png" : "../../static/images/camera-off.png";
            document.getElementById("video_mask").style.visibility = camera_enabled ? 'hidden' : 'visible';
            videoEnabledField.value = (camera_enabled) ? "1" : "0";
            setVideoState(camera_enabled);
        }
        else {
            alert("Error! Your camera can not be accessed!");
        }
    });

    mic_image.addEventListener('click', () => {
        if (!audioError) {
            mic_enabled = !mic_enabled;
            mic_image.src = (mic_enabled) ? "../../static/images/mic-on.png" : "../../static/images/mic-off.png";
            document.getElementById("mic_tag").style.visibility = mic_enabled ? 'hidden' : 'visible';
            audioEnabledField.value = (mic_enabled) ? "1" : "0";
            setAudioState(mic_enabled);
        }
        else {
            alert("Error! Your mic can not be accessed!");
        }
    });
});