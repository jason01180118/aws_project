from flask import Flask
import os
import time
from router import index,  index, video_room
from flask_socketio import SocketIO

# EB looks for an 'application' callable by default.
application = Flask(__name__)
application.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(application, cors_allowed_origins="*")

application.add_url_rule('/index', 'index',
                         index, methods=['GET', 'POST'])

application.add_url_rule('/', 'index',
                         index, methods=['GET', 'POST'])

application.add_url_rule('/videoroom/<string:room>', 'videoroom',
                         video_room, methods=['GET', 'POST'])


def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')


@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)


if __name__ == '__main__':
    application.debug = True
    socketio.run(application)
