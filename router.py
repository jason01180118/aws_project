from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import send, emit


def index():
    if request.method == 'POST':
        room = request.values.get('room')
        if request.values.get('username') != '':
            return redirect(url_for("videoroom", room=room))
        return render_template("chatroom_added.html", room=room)
    return render_template("index.html")


def video_room(room):
    return render_template("video_room.html")
