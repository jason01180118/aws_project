from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import send, emit


def index():
    if request.method == 'POST':
        return redirect(url_for("videoroom", room=request.values.get('room')))
    return render_template("index.html")


def chatroom_added(room):
    if request.method == 'POST':
        return render_template("video_room.html", username=request.values.get('username'))
    return render_template("chatroom_added.html")
