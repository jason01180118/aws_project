from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import send, emit


def index():
    if request.method == 'POST':
        return redirect(url_for("videoroom", room_id=request.values.get('room')))
    return render_template("index.html")


def chatroom_added(room_id):
    if request.method == 'POST':
        username = request.values.get('username')
        mute_audio = request.values.get('mute_audio')
        mute_video = request.values.get('mute_video')
        session[room_id] = {"name": username, "mute_audio":mute_audio, "mute_video":mute_video}
        return render_template("video_room.html", room_id=room_id, username=username, mute_audio=mute_audio, mute_video=mute_video)
    return render_template("chatroom_added.html")
