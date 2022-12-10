from flask import Flask
import os
import time
from flask import request, session
from router import index, video_room, socket_io_test
from flask_socketio import SocketIO

# EB looks for an 'application' callable by default.
application = Flask(__name__)
application.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(application, cors_allowed_origins="*")

application.add_url_rule('/index', 'index', index, methods=['GET', 'POST'])

application.add_url_rule('/', 'index', index, methods=['GET', 'POST'])

application.add_url_rule('/socket_io_test', 'socket_io_test', socket_io_test, methods=['GET', 'POST'])

application.add_url_rule('/videoroom/<string:room>', 'videoroom', video_room, methods=['GET', 'POST'])

socket_sid_pool = {}
socket_room_pool = {}



def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')


@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)


@socketio.on("connect")
def on_connect():
    sid = request.sid # 每個request 都有自己的sid
    print("session", session)
    print("New socket connected ", sid)

@socketio.on("join-room")
def socket_on_join_room(data):
    sid = request.sid
    room_id = data["room_id"]
    display_name = session[room_id]["name"]


#     # register sid to the room
#     join_room(room_id)
#     _room_of_sid[sid] = room_id
#     _name_of_sid[sid] = display_name
#
#     # broadcast to others in the room
#     print("[{}] New member joined: {}<{}>".format(room_id, display_name, sid))
#     emit("user-connect", {"sid": sid, "name": display_name}, broadcast=True, include_self=False, room=room_id)
#
#     # add to user list maintained on server
#     if room_id not in _users_in_room:
#         _users_in_room[room_id] = [sid]
#         emit("user-list", {"my_id": sid}) # send own id only
#     else:
#         usrlist = {u_id:_name_of_sid[u_id] for u_id in _users_in_room[room_id]}
#         emit("user-list", {"list": usrlist, "my_id": sid}) # send list of existing users to the new member
#         _users_in_room[room_id].append(sid) # add new member to user list maintained on server
#
#     print("\nusers: ", _users_in_room, "\n")
#
#
# @socketio.on("disconnect")
# def on_disconnect():
#     sid = request.sid
#     room_id = _room_of_sid[sid]
#     display_name = _name_of_sid[sid]
#
#     print("[{}] Member left: {}<{}>".format(room_id, display_name, sid))
#     emit("user-disconnect", {"sid": sid}, broadcast=True, include_self=False, room=room_id)
#
#     _users_in_room[room_id].remove(sid)
#     if len(_users_in_room[room_id]) == 0:
#         _users_in_room.pop(room_id)
#
#     _room_of_sid.pop(sid)
#     _name_of_sid.pop(sid)
#
#     print("\nusers: ", _users_in_room, "\n")
#
#
# @socketio.on("data")
# def on_data(data):
#     sender_sid = data['sender_id']
#     target_sid = data['target_id']
#     if sender_sid != request.sid:
#         print("[Not supposed to happen!] request.sid and sender_id don't match!!!")
#
#     if data["type"] != "new-ice-candidate":
#         print('{} message from {} to {}'.format(data["type"], sender_sid, target_sid))
#     socketio.emit('data', data, room=target_sid)


if __name__ == '__main__':
    application.debug = True
    socketio.run(application)
