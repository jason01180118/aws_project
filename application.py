from flask import Flask, render_template, request, redirect, url_for, session
import os
import time
from router import index, sayhello, upload_file, chat_room, video_chat_room, chat_index, video_room
from flask_socketio import SocketIO, emit, join_room, leave_room

# EB looks for an 'application' callable by default.
application = Flask(__name__)
application.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(application, cors_allowed_origins="*")

application.add_url_rule(
    '/image', 'image', upload_file, methods=['GET', 'POST'])

application.add_url_rule('/chatroom/<room>', 'chat',
                         chat_room, methods=['GET', 'POST'])

application.add_url_rule('/chatindex', 'chatindex',
                         chat_index, methods=['GET', 'POST'])

application.add_url_rule('/videoroom/<room>', 'videoroom',
                         video_room, methods=['GET', 'POST'])

application.add_url_rule('/', 'index', index)

application.add_url_rule('/<username>', 'hello',
                         (lambda username: sayhello(username)))

application.add_url_rule(
    '/video_chat', video_chat_room, methods=['GET', 'POST'])


def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')


@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)



if __name__ == '__main__':
    application.debug = True
    socketio.run(application)
