document.addEventListener("DOMContentLoaded", (event) => {
    let mediaConstraints = { audio: true, video: { height: 360 } };
    let videoConstraints = { video: { height: 360 } };
    let audioConstraints = { audio: true };

    if (screen_share) {
        startScreenCapture()
            .then(mediaInit);
    }
    else {
        startCamera()
            .then(mediaInit);
    }

    function startCamera() {
        const promiseMedia = navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(setStream)
            .catch((e) => {
                if (e.name == "NotReadableError") {
                    const promiseAudio = navigator.mediaDevices.getUserMedia(audioConstraints)
                        .then(setStream)
                        .catch((e) => {
                            audioError = true;
                            logError(e);
                        });
                    const promiseVideo = navigator.mediaDevices.getUserMedia(videoConstraints)
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
        const promiseMedia = navigator.mediaDevices.getDisplayMedia(mediaConstraints)
            .then(setStream)
            .catch((e) => {
                if (e.name == "NotReadableError") {
                    const promiseAudio = navigator.mediaDevices.getDisplayMedia(audioConstraints)
                        .then(setStream)
                        .catch((e) => {
                            audioError = true;
                            logError(e);
                        });
                    const promiseVideo = navigator.mediaDevices.getDisplayMedia(videoConstraints)
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
        document.getElementById("mic_mute").src = (mic_enabled) ? mic_on_path : mic_off_path;
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
