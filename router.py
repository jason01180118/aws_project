from detect_image import detect_one_label
from flask import Flask, render_template, request, redirect
from flask_socketio import send, emit


def index():
    if request.method == 'POST':
        try:
            if request.values.get('username') != '':
                return redirect('/videoroom/'+request.values.get('username'))
        except:
            if request.values.get('room') != '':
                return render_template("chatroom_added.html", room=request.values.get('room'))
    return render_template("index.html")


def video_room(room):
    return render_template("video_room.html")
