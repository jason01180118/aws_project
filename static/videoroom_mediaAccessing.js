var media_allowed = true;
var share_enabled = false;
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
    if(screen_share){
        startScreenCapture();
    } else{
        startCamera();
    }

    var share_image = document.querySelector("#share");

    if(isMobileDevice()) {
        share_image.addEventListener('touchstart', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? "../../static/images/share-on.png" : "../../static/images/share-off.png";
        });
    
        share_image.addEventListener('touchend', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? "../../static/images/share-on.png" : "../../static/images/share-off.png";
            alert("This feature is currently unavailable on mobile devices!");
        });
    } else {
        share_image.addEventListener('mousedown', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? "../../static/images/share-on.png" : "../../static/images/share-off.png";
        });
    
        share_image.addEventListener('mouseup', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? "../../static/images/share-on.png" : "../../static/images/share-off.png";
            share_btn = document.createElement("a");
            share_btn.href=`${location.protocol}//${location.host}${location.pathname}?share=1&username=${myName}`;
            share_btn.target = "_blank";
            share_btn.click();
        });
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