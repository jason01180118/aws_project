var myVideo;
var share_enabled = false;

document.addEventListener("DOMContentLoaded", (event) => {
    new QRCode(document.getElementById("qrcode"), {
        text: `${location.protocol}//${location.host}${location.pathname}`,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    document.getElementById("href").innerText = `${location.protocol}//${location.host}${location.pathname}`
    document.getElementById("copyhref").addEventListener('click', () => {
        navigator.clipboard.writeText(`${location.protocol}//${location.host}${location.pathname}`)
            .then(() => {
                console.log("Text copied to clipboard...")
            })
            .catch(err => {
                console.log('Something went wrong', err);
            })
    })
    document.getElementById("msg").addEventListener('focus', () => {
        document.addEventListener('keydown', detectKey)
    })
    document.getElementById("msg").addEventListener('focusout', () => {
        document.removeEventListener('keydown', detectKey)
    })
    function detectKey(key) {
        if (key.key === 'Enter') {
            var chat_msg = document.getElementById("msg").value;
            document.getElementById("msg").value = ''
            socket.emit("chat-send", { "room": myRoomID, "username": myName, "msg": chat_msg });
        }
    }
    myVideo = document.querySelector("#videoElement");
    var camera_image = document.querySelector("#camera_mute");
    var mic_image = document.querySelector("#mic_mute");
    var share_image = document.querySelector("#share");
    var callEndBttn = document.querySelector("#call_end");
    var chat_submit_btn = document.querySelector("#msgsend");

    camera_image.addEventListener('click', () => {
        if (!videoError) {
            camera_enabled = !camera_enabled;
            camera_image.src = (camera_enabled) ? "../../static/images/camera-on.png" : "../../static/images/camera-off.png";
            setVideoState(camera_enabled);
            socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "C", "state": camera_enabled });
        }
        else {
            alert("Error! Your camera can not be accessed!");
        }
    });

    mic_image.addEventListener('click', function () {
        if (!audioError) {
            mic_enabled = !mic_enabled;
            mic_image.src = (mic_enabled) ? "../../static/images/mic-on.png" : "../../static/images/mic-off.png";
            setAudioState(mic_enabled);
            socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "M", "state": mic_enabled });
        }
        else {
            alert("Error! Your mic can not be accessed!");
        }
    });

    share_image.addEventListener('click', () => {
        share_enabled = !share_enabled;
        share_image.src = (share_enabled) ? "../../static/images/share-on.png" : "../../static/images/share-off.png";
        share_btn = document.createElement("a");
        share_btn.href=`${location.protocol}//${location.host}${location.pathname}?share=1&username=${myName}`;
        share_btn.target = "_blank";
        share_btn.click();
    });

    callEndBttn.addEventListener("click", (event) => {
        window.location.replace("/");
    });

    chat_submit_btn.addEventListener('click', () => {
        var chat_msg = document.getElementById("msg").value;
        document.getElementById("msg").value = ''
        socket.emit("chat-send", { "room": myRoomID, "username": myName, "msg": chat_msg });
    });
});


function makeVideoElement(element_id, display_name) {
    let wrapper_div = document.createElement("div");
    let vid_wrapper = document.createElement("div");
    let vid = document.createElement("video");
    let name_text = document.createElement("div");

    wrapper_div.id = "div_" + element_id;
    vid.id = "vid_" + element_id;

    wrapper_div.className = "video-item";
    vid_wrapper.className = "vid-wrapper";
    name_text.className = "display-name";
    vid.className = "video"

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

function setOtherUserVideoState(peer_id, flag) {//需要加上別的用戶關閉鏡頭時的動作
    let wrapper_div = document.querySelector("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
    console.log(peer_id + " camera state change to " + flag);
}

function setOtherUserAudioState(peer_id, flag) {//需要加上別的用戶關閉麥克風時的動作
    let wrapper_div = document.querySelector("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
    console.log(peer_id + " mic state change to " + flag);
}

function makeChatElement(sender, msg) {
    let now = new Date();
    let msg_div = document.createElement("div");
    let msg_p = document.createElement("p");

    msg_div.className = "msg_div bar";
    msg_p.className = "msg_p";

    msg_p.innerText = sender + ' 在 '+ now.getHours() + ':' + now.getMinutes() + ' 時 說：\n' + msg;

    msg_div.appendChild(msg_p);

    return msg_div;
}

function newChatMsg(sender, msg) {
    document.querySelector("div.chat_holder").append(makeChatElement(sender, msg));
    document.querySelector("div.chat_holder").scrollTop = document.querySelector("div.chat_holder").scrollHeight
}