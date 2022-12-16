document.addEventListener("DOMContentLoaded", (event) => {
    let current_url = `${location.protocol}//${location.host}${location.pathname}`;
    new QRCode(document.getElementById("qrcode"), {
        text: current_url,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    document.getElementById("qrcode_link").innerText = current_url;
    document.getElementById("copy_qrcode_link").addEventListener('click', () => {
        navigator.clipboard.writeText(current_url)
            .then(() => {
                console.log("Url copied to clipboard...")
            })
            .catch(logError)
    })

    document.getElementById("msg").addEventListener('focus', () => {
        document.addEventListener('keydown', detectKey)
    })
    document.getElementById("msg").addEventListener('focusout', () => {
        document.removeEventListener('keydown', detectKey)
    })

    let camera_image = document.getElementById("camera_mute");
    let mic_image = document.getElementById("mic_mute");
    let callEndBttn = document.getElementById("call_end");
    let chat_submit_btn = document.getElementById("msgsend");
    let share_image = document.getElementById("share");

    camera_image.addEventListener('click', () => {
        if (!videoError) {
            camera_enabled = !camera_enabled;
            camera_image.src = (camera_enabled) ? camera_on_path : camera_off_path;
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
            mic_image.src = (mic_enabled) ? mic_on_path : mic_off_path;
            setAudioState(mic_enabled);
            socket.emit("state-change", { "room": myRoomID, "sid": myPeerID, "CorM": "M", "state": mic_enabled });
        }
        else {
            alert("Error! Your mic can not be accessed!");
        }
    });

    let share_enabled = false;
    if (isMobileDevice()) {
        share_image.addEventListener('touchstart', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? share_on_path : share_off_path;
        });

        share_image.addEventListener('touchend', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? share_on_path : share_off_path;
            alert("This feature is currently unavailable on mobile devices!");
        });
    }
    else {
        share_image.addEventListener('mousedown', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? share_on_path : share_off_path;
        });

        share_image.addEventListener('mouseup', () => {
            share_enabled = !share_enabled;
            share_image.src = (share_enabled) ? share_on_path : share_off_path;
            document.getElementById("share_screen_form").submit();
        });
    }

    callEndBttn.addEventListener("click", (event) => {
        window.location.replace("/");
    });

    chat_submit_btn.addEventListener("click", chatSubmit);

    function detectKey(key) {
        if (key.key === 'Enter') {
            chatSubmit();
        }
    }

    function chatSubmit() {
        let chat_msg = document.getElementById("msg").value;
        document.getElementById("msg").value = '';
        console.log(`chat msg send`)
        socket.emit("chat-send", { "room": myRoomID, "username": myName, "msg": chat_msg });
    }

    function isMobileDevice() {
        let mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
        let isMobileDevice = false
        mobileDevices.forEach((i) => {
            if (navigator.userAgent.match(i)) {
                isMobileDevice = true
            }
        });
        console.log(`This device is mobile device: ${isMobileDevice}`)
        return isMobileDevice
    }
});

function addVideoElement(element_id, display_name) {
    document.querySelector("div.user_holder").append(makeVideoElement(element_id, display_name));

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
    let stream = document.getElementById("videoElement").srcObject;
    let track = stream.getVideoTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}

function setAudioState(flag) {
    let stream = document.getElementById("videoElement").srcObject;
    let track = stream.getAudioTracks();
    for (let i = 0; i < track.length; i++) {
        track[i].enabled = flag;
    }
}

function setOtherUserVideoState(peer_id, flag) {//需要加上別的用戶關閉鏡頭時的動作
    let wrapper_div = document.getElementById("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
    console.log(peer_id + " camera state change to " + flag);
}

function setOtherUserAudioState(peer_id, flag) {//需要加上別的用戶關閉麥克風時的動作
    let wrapper_div = document.getElementById("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
    console.log(peer_id + " mic state change to " + flag);
}

function addChatMsg(sender, msg) {
    let chat_holder = document.querySelector("div.chat_holder");
    chat_holder.append(makeChatElement(sender, msg));
    chat_holder.scrollTop = chat_holder.scrollHeight

    function makeChatElement(sender, msg) {
        let now = new Date();
        let msg_div = document.createElement("div");
        let msg_p = document.createElement("p");

        msg_div.className = "msg_div bar";
        msg_p.className = "msg_p";

        msg_p.innerText = `${sender} 在 ${now.getHours()}:${now.getMinutes()} 時 說：\n${msg}`;

        msg_div.appendChild(msg_p);

        return msg_div;
    }
}