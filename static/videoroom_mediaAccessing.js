document.addEventListener("DOMContentLoaded", (event) => {
    if (screen_share) {
        startScreenCapture()
            .then(mediaInit);
    }
    else {
        startCamera()
            .then(mediaInit);
    }

    function startCamera() {
        const promiseMedia = navigator.mediaDevices.getUserMedia({ audio: true, video: { height: 360 } })
            .then(setStream)
            .catch((e) => {
                if (e.name == "NotReadableError") {
                    const promiseAudio = navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(setStream)
                        .catch((e) => {
                            audioError = true;
                            logError(e);
                        });
                    const promiseVideo = navigator.mediaDevices.getUserMedia({ video: { height: 360 } })
                        .then(setStream)
                        .catch((e) => {
                            videoError = true;
                            logError(e);
                        });
                    return Promise.allSettled([promiseAudio, promiseVideo]);
                }
                else if (e.name == "NotAllowedError") {
                    handleNotAllow();
                    logError(e);
                }
                else {
                    logError(e);
                }
            });
        return Promise.allSettled([promiseMedia]);
    }

    function startScreenCapture() {
        const promiseMedia = navigator.mediaDevices.getDisplayMedia({ audio: true, video: { height: 480 } })
            .then(setStream)
            .catch((e) => {
                if (e.name == "NotReadableError") {
                    const promiseAudio = navigator.mediaDevices.getDisplayMedia({ audio: true })
                        .then(setStream)
                        .catch((e) => {
                            audioError = true;
                            logError(e);
                        });
                    const promiseVideo = navigator.mediaDevices.getDisplayMedia({ video: { height: 480 } })
                        .then(setStream)
                        .catch((e) => {
                            videoError = true;
                            logError(e);
                        });
                    return Promise.allSettled([promiseAudio, promiseVideo]);
                }
                else if (e.name == "NotAllowedError") {
                    handleNotAllow();
                    logError(e);
                }
                else {
                    logError(e);
                }
            });
        return Promise.allSettled([promiseMedia]);
    }

    function mediaInit() {
        if (videoError) {
            camera_enabled = false;
        }
        if (audioError) {
            mic_enabled = false;
        }
        document.getElementById("camera_mute").src = (camera_enabled) ? camera_on_path : camera_off_path;
        document.getElementById("video_mask").style.visibility = camera_enabled ? 'hidden' : 'visible';
        document.getElementById("mic_mute").src = (mic_enabled) ? mic_on_path : mic_off_path;
        document.getElementById("mic_tag").style.visibility = mic_enabled ? 'hidden' : 'visible';
        setVideoState(camera_enabled);
        setAudioState(mic_enabled);
        socket.connect();
    }

    function handleNotAllow() {
        audioError = true;
        videoError = true;
        myVideo.srcObject = new MediaStream();
    }

    function setStream(stream) {
        myVideo.srcObject = stream;
    }
});
