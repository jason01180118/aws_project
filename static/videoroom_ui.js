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
        document.getElementById("msg").addEventListener("compositionstart", function chinput() {
            document.removeEventListener('keydown', detectKey)
            document.getElementById("msg").addEventListener("compositionend", function chinputend() {
                document.getElementById("msg").removeEventListener("compositionstart", chinput)
                document.getElementById("msg").removeEventListener("compositionend", chinputend)
                document.addEventListener('keydown', detectKey)
            })
        })
    })
    document.getElementById("msg").addEventListener('focusout', () => {
        document.removeEventListener('keydown', detectKey)
    })

    let camera_image = document.getElementById("camera_mute");
    let mic_image = document.getElementById("mic_mute");
    let callEndBttn = document.getElementById("call_end");
    let chat_submit_btn = document.getElementById("msgsend");
    let share_image = document.getElementById("share");
    let leaveCancel = document.getElementById("leave_cancel");
    let leaveSure = document.getElementById("leave_sure");
    let my_video_mask_path = `../../static/images/video_mask${getRandomIntInclusive(0, 4)}.png`;

    document.getElementById("video_mask").children[0].src = my_video_mask_path;

    camera_image.addEventListener('click', () => {
        if (!videoError) {
            camera_enabled = !camera_enabled;
            camera_image.src = (camera_enabled) ? camera_on_path : camera_off_path;
            document.getElementById("video_mask").style.visibility = camera_enabled ? 'hidden' : 'visible';
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
            document.getElementById("mic_tag").style.visibility = mic_enabled ? 'hidden' : 'visible';
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
        document.getElementById("leave_page").style.visibility = 'visible'
    });

    leaveCancel.addEventListener('click', () => {
        document.getElementById("leave_page").style.visibility = 'hidden'
    })

    leaveSure.addEventListener('click', () => {
        window.location.replace("/");
    })

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
    document.getElementById("div_" + element_id).style.visibility = selected ? 'hidden' : 'visible';

    function makeVideoElement(element_id, display_name) {
        let wrapper_div = document.createElement("div");
        let vid_wrapper = document.createElement("div");
        let vid = document.createElement("video");
        let video_mask_div = document.createElement("div");
        let video_mask_img = document.createElement("img");
        let mic_tag_div = document.createElement("div");
        let mic_tag_img = document.createElement("img");
        let name_text = document.createElement("div");
        let name_circle = document.createElement("div");
        let video_mask_path = `../../static/images/video_mask${getRandomIntInclusive(0, 4)}.png`;

        wrapper_div.id = "div_" + element_id;
        vid.id = "vid_" + element_id;

        wrapper_div.className = "video-item";
        vid_wrapper.className = "vid-wrapper";
        vid.className = "video";
        video_mask_div.className = "others_video_mask_div";
        video_mask_img.className = "others_video_mask_img";
        mic_tag_div.className = "others_mic_tag_div";
        mic_tag_img.className = "others_mic_tag_img";
        name_text.className = "display-name";
        name_circle.className = "display-name-circle";
        video_mask_img.src = video_mask_path;
        mic_tag_img.src = mic_off_path;

        vid.autoplay = true;

        name_text.innerText = display_name;
        name_text.prepend(name_circle);

        video_mask_div.appendChild(video_mask_img);
        mic_tag_div.appendChild(mic_tag_img);
        vid_wrapper.appendChild(vid);
        vid_wrapper.appendChild(video_mask_div);
        vid_wrapper.appendChild(mic_tag_div);
        vid_wrapper.appendChild(name_text);
        wrapper_div.appendChild(vid_wrapper);
        wrapper_div.addEventListener("click", () => {
            user_holder = document.getElementsByClassName('user_holder');
            let translateX = user_holder[0].offsetLeft + user_holder[0].clientWidth / 2 - (wrapper_div.getBoundingClientRect().left + wrapper_div.getBoundingClientRect().width / 2);
            let translateY = user_holder[0].offsetTop + user_holder[0].clientHeight / 2 - (wrapper_div.getBoundingClientRect().top + wrapper_div.getBoundingClientRect().height / 2);
            console.log(user_holder[0].offsetLeft + user_holder[0].clientWidth / 2, user_holder[0].offsetTop + user_holder[0].clientHeight / 2)
            selected = !selected;
            wrapper_div.style.transform = selected ? `translate(${translateX.toString()}px,${translateY.toString()}px)scale(2.2)` : '';
            vid_wrapper.style.marginTop = selected ? '3.3%' : '5%';
            vid_wrapper.style.marginBottom = selected ? '3.3%' : '5%';
            wrapper_div.style.transformOrigin = 'center center';
            wrapper_div.style.transitionDuration = '200ms';
            document.getElementById("grid-container").style.overflow = selected ? 'hidden' : 'scroll';
            for (const [key, value] of Object.entries(_peer_list)) {
                let change_id = "div_" + key
                if (change_id !== wrapper_div.id) {
                    document.getElementById(change_id).style.visibility = selected ? 'hidden' : 'visible';
                    document.getElementById(change_id).children[0].style.display = selected ? 'none' : 'flex';
                }
            }
        })
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
    wrapper_div.children[0].children[1].style.visibility = flag ? 'hidden' : 'visible';
    console.log(peer_id + " camera state change to " + flag);
}

function setOtherUserAudioState(peer_id, flag) {//需要加上別的用戶關閉麥克風時的動作
    let wrapper_div = document.getElementById("div_" + peer_id);//等同上面function makeVideoElement裡面的wrapper_div
    wrapper_div.children[0].children[2].style.visibility = flag ? 'hidden' : 'visible';
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

        msg_p.innerText = `${sender} 在 ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} 時 說：\n${msg}`;

        msg_div.appendChild(msg_p);

        return msg_div;
    }
}