#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
import sys
import urllib3
import logging
import boto3 #acceso a aws-poner credenciales en .aws
from decimal import Decimal
from datetime import *

#seteo nivel de log
#logging.basicConfig(level=logging.DEBUG)
##logging.basicConfig(level=logging.INFO)

## doc api bcra:
## https://estadisticasbcra.com/api/documentation

url = "http://api.estadisticasbcra.com/usd_of"

##en dias poner desde cuantos dias atras arranco a importar
dias = 30
startdate = int((datetime.now()-timedelta(dias)).strftime("%Y%m%d"))
logging.info(startdate)

headers = {
    'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzM3MzQxNDUsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJtaXJhdmFsbGVzZ0BnbWFpbC5jb20ifQ.4Kb5JA1RiwN9DSxqH319B1aT-DWiYflz6odQbB3cAAL3hCJMOpe8rXOBHvcQyWruoVVME2uUTx4F35ZNQa8dVg",
    'Accept': "*/*",
    'Accept-Encoding': "gzip, deflate",
    'Connection': "keep-alive",
    'cache-control': "no-cache"
    }

response = requests.request("POST", url, headers=headers).json() #.json() pasa la respuesta a un objeto json

##respuesta ejemplo para debug sin pegarle a la api
##response = json.loads('[{"d": "2003-08-20","v": 2.91},{"d": "2016-04-01","v": 14.05},{"d": "2016-04-02","v": 14.06}]')


##defino conexion a tabla
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('usd')

#voy insertando por cada item en tabla
for x in response:
    logging.info(x['d'][0:4]+x['d'][5:7]+x['d'][8:10])

    if int(x['d'][0:4]+x['d'][5:7]+x['d'][8:10]) > startdate:
        table.put_item(
                Item={
                    'd': x['d'],
                    'v': Decimal(str(x['v']))
                     }
                )




