from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import send, emit


def index():
    if request.method == 'POST':
        return redirect(url_for("videoroom", room_id=request.values.get('room')))
    return render_template("index.html")


def videoroom_added(room_id):
    if request.method == 'POST':
        username = request.values.get('username')
        audio_enabled = request.values.get('audio_enabled')
        video_enabled = request.values.get('video_enabled')
        session[room_id] = {"name": username, "audio_enabled":audio_enabled, "video_enabled":video_enabled}
        return render_template("video_room.html", room_id=room_id, username=username, audio_enabled=audio_enabled, video_enabled=video_enabled)
    return render_template("videoroom_added.html", room_id=room_id)
