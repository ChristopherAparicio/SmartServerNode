#!/usr/bin/env python
# coding: utf-8

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
		"volume":0

	}
json_data_registration = json.dumps(data)

with SocketIO('localhost', 8080, LoggingNamespace) as socketIO:
    socketIO.on('raspberry_registration', on_res)
    print(data);
    socketIO.emit('raspberry_registration', json_data_registration,on_res)
    socketIO.emit('hello', 'Hello Boy')
    socketIO.wait_for_callbacks(seconds=60)
    #socketIO.wait() Wait Forever