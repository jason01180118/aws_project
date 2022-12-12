var myVideo;

document.addEventListener("DOMContentLoaded", (event) => {
    myVideo = document.getElementById("videoElement");
    var camera_mute_checkbox = document.querySelector("#camera_mute");
    var mic_mute_checkbox = document.querySelector("#mic_mute");
    var callEndBttn = document.getElementById("call_end");

    camera_mute_checkbox.addEventListener('change', () => {
        if (!videoError) {
            camera_enabled = camera_mute_checkbox.checked;
            setVideoState(camera_enabled);
            socket.emit("state-change", { "sid": myPeerID, "CorM": "C", "state": camera_enabled });
        }
        else {
            camera_mute_checkbox.checked = false;
            alert("Error! Your camera can not be accessed!");
        }
    });

    mic_mute_checkbox.addEventListener('change', function () {
        if (!audioError) {
            mic_enabled = mic_mute_checkbox.checked;
            setAudioState(mic_enabled);
            socket.emit("state-change", { "sid": myPeerID, "CorM": "M", "state": camera_enabled });
        }
        else {
            mic_mute_checkbox.checked = false;
            alert("Error! Your mic can not be accessed!");
        }
    });

    callEndBttn.addEventListener("click", (event) => {
        window.location.replace("/");
    });
});


function makeVideoElement(element_id, display_name) {
    let wrapper_div = document.createElement("div");
    let vid_wrapper = document.createElement("div");
    let vid = document.createElement("video");
    let name_text = document.createElement("div");

    wrapper_div.id = "div_" + element_id;
    vid.id = "vid_" + element_id;

    wrapper_div.className = "shadow video-item";
    vid_wrapper.className = "vid-wrapper";
    name_text.className = "display-name";

    vid.autoplay = true;
    name_text.innerText = display_name;

    vid_wrapper.appendChild(vid);
    wrapper_div.appendChild(vid_wrapper);
    wrapper_div.appendChild(name_text);

    return wrapper_div;
}

function addVideoElement(element_id, display_name) {
    document.querySelector("div.user_holder").append(makeVideoElement(element_id, display_name));
}
function removeVideoElement(element_id) {
    let v = getVideoObj(element_id);
    if (v.srcObject) {
        v.srcObject.getTracks().forEach(track => track.stop());
    }
    v.removeAttribute("srcObject");
    v.removeAttribute("src");

    document.getElementById("div_" + element_id).remove();
}

function getVideoObj(element_id) {
    return document.getElementById("vid_" + element_id);
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

function setOtherUserVideoState(peer_id, flag) {
    let wrapper_div = document.querySelector("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
}

function setOtherUserAudioState(peer_id, flag) {
    let wrapper_div = document.querySelector("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
}