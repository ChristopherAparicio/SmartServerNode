#!/usr/bin/env python
# coding: utf-8
from subprocess import call
from socketIO_client import SocketIO, BaseNamespace, LoggingNamespace
import uuid
import json

from random import randint


def get_mac():
  mac_num = hex(uuid.getnode()).replace('0x', '').upper()
  mac = '-'.join(mac_num[i : i + 2] for i in range(0, 11, 2))
  return mac


def mock_get_mac():
	returnString = "raspberry"+str(randint(0,100))
	return returnString

def on_res(*args):
    print('on_reponse',args)



data = {	
		"raspberryId":mock_get_mac(),
		"etat":"ATTENTE",
		"volume":0,
        "musique_courrante":"None",
        "musique_suivante":"None"
	}

def on_jouer():
    data["etat"]="JOUE"
    print(data)

def on_pause():
    data["etat"]="ATTENTE"
    print(data)

def on_playnextmusique():
    if data["musique_suivante"] != "None":
      data["musique_courrante"] = data["musique_suivante"]
      data["musique_suivante"] = "None"
    print(data)

def on_volumeUP():
    if data["volume"] < 20:
      data["volume"] += 1
      call(["amixer", "-D", "pulse", "sset", "Master", str(data["volume"]*100/20)"%"])


def on_volumeDown():
    if data["volume"] > 0:
      data["volume"] -= 1
      call(["amixer", "-D", "pulse", "sset", "Master", str(data["volume"]*100/20)"%"])


def on_changeNextMusic(*args):
    for elem in args:
      data["musique_suivante"] = elem



json_data_registration = json.dumps(data)

with SocketIO('localhost', 8080, LoggingNamespace) as socketIO:
    socketIO.on('raspberry_registration', on_res)
    socketIO.on('jouer',on_jouer)
    socketIO.on('pause',on_pause)
    socketIO.on('playnextmusique',on_playnextmusique)
    socketIO.on('volumeup',on_volumeUP)
    socketIO.on('volumedown',on_volumeDown)
    socketIO.on('changeMusiqueSuivante',on_changeNextMusic)
    print(data);
    socketIO.emit('raspberry_registration', json_data_registration,on_res)
    socketIO.emit('hello', 'Hello Boy')

    socketIO.wait_for_callbacks(seconds=300)
    #socketIO.wait() Wait Forever
