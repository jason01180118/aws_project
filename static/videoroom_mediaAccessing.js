var media_allowed = true;
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

document.addEventListener("DOMContentLoaded", (event) => {
    if(screen_share==1){
        startScreenCapture();
    }
    else{
        startCamera();
    }
});

function startCamera() {
    const promiseMedia = navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then((stream) => {
            myVideo.srcObject = stream;
        })
        .catch((e) => {
            if (e.name == "NotReadableError") {
                const promiseAudio = navigator.mediaDevices.getUserMedia(audioConstraints)
                    .then((stream) => {
                        myVideo.srcObject = stream;
                    })
                    .catch((e) => {
                        audioError = true;
                        log_error(e);
                    });
                const promiseVideo = navigator.mediaDevices.getUserMedia(videoConstraints)
                    .then((stream) => {
                        myVideo.srcObject = stream;
                    })
                    .catch((e) => {
                        videoError = true;
                        log_error(e);
                    });
                return Promise.allSettled([promiseAudio, promiseVideo]);
            }
            else if (e.name == "NotAllowedError") {
                media_allowed = false;
                audioError = true;
                videoError = true;
                myVideo.srcObject = new MediaStream();
                log_error(e);
            }
            else {
                log_error(e);
            }
        })
        .then(() => {
            mediaInit();
            socket.connect();
        });
    return Promise.allSettled([promiseMedia]);
}

function startScreenCapture() {
    const promiseMedia = navigator.mediaDevices.getDisplayMedia(mediaConstraints)
        .then((stream) => {
            myVideo.srcObject = stream;
        })
        .catch((e) => {
            if (e.name == "NotReadableError") {
                const promiseAudio = navigator.mediaDevices.getDisplayMedia(audioConstraints)
                    .then((stream) => {
                        myVideo.srcObject = stream;
                    })
                    .catch((e) => {
                        audioError = true;
                        log_error(e);
                    });
                const promiseVideo = navigator.mediaDevices.getDisplayMedia(videoConstraints)
                    .then((stream) => {
                        myVideo.srcObject = stream;
                    })
                    .catch((e) => {
                        videoError = true;
                        log_error(e);
                    });
                return Promise.allSettled([promiseAudio, promiseVideo]);
            }
            else if (e.name == "NotAllowedError") {
                media_allowed = false;
                audioError = true;
                videoError = true;
                myVideo.srcObject = new MediaStream();
                log_error(e);
            }
            else {
                log_error(e);
            }
        })
        .then(() => {
            mediaInit();
            socket.connect();
        });
    return Promise.allSettled([promiseMedia]);
}

function mediaInit(){
    if (videoError) {
        camera_enabled = false;
    }
    if (audioError) {
        mic_enabled = false;
    }
    document.querySelector("#camera_mute").src = (camera_enabled) ? "../../static/images/camera-on.png" : "../../static/images/camera-off.png";
    document.querySelector("#mic_mute").src = (mic_enabled) ? "../../static/images/mic-on.png" : "../../static/images/mic-off.png";
    setVideoState(camera_enabled);
    setAudioState(mic_enabled);
}