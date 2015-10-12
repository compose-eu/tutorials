#!/usr/bin/python
# -*- coding: latin-1 -*-

from configuration import *
import requests
import urllib
import json,time,random
from urllib2 import Request, urlopen
from dns.tokenizer import Token
from requests.auth import HTTPDigestAuth

def getToken(user,password):
    global token
    URL      = idmEndpoint + '/auth/user/'
    idmData = '{"username":"' + user + '","password":"' + password +'"}'
    headers = {
               "Content-Type": "application/json;charset=UTF-8"
    }

    response = requests.post(URL,data=idmData,headers=headers)
    json = response.json()
    token = json["accessToken"]
    return token

def createSO(product):
    global token
    product_so = json.dumps(
                                {"name": product["name"],
                                 "description": product["description"],
                                 "public":"true",
                                 "streams": {
                                             "price": {
                                                       "channels": {
                                                                    "value": {
                                                                              "type": "Number",
                                                                              "unit": "euros"
                                                                              }
                                                                    },
                                                       "description": "Price information",
                                                       "type": "sensor"
                                                       },
                                             "checkins": {
                                                          "channels": {
                                                                       "user": {
                                                                                "type": "String",
                                                                                "unit": "id"
                                                                                },
                                                                       "location": {
                                                                                    "type": "geo_point",
                                                                                    "unit": "lat-long"
                                                                                    }
                                                                       },
                                                          "description": "Checkins",
                                                          "type": "sensor"
                                                          },
                                             "scans": {
                                                       "channels": {
                                                                    "user": {
                                                                             "type": "String",
                                                                             "unit": "id"
                                                                             },
                                                                    "location": {
                                                                                 "type": "geo_point",
                                                                                 "unit": "lat-long"
                                                                                 }
                                                                    },
                                                       "description": "Scans",
                                                       "type": "sensor"
                                                       },
                                             "shares": {
                                                          "channels": {
                                                                       "user": {
                                                                                "type": "String",
                                                                                "unit": "id"
                                                                                },
                                                                       "location": {
                                                                                    "type": "geo_point",
                                                                                    "unit": "lat-long"
                                                                                    }
                                                                       },
                                                          "description": "Shares",
                                                          "type": "sensor"
                                                        },
                                             "tocart": {
                                                          "channels": {
                                                                       "user": {
                                                                                "type": "String",
                                                                                "unit": "id"
                                                                                },
                                                                       "location": {
                                                                                    "type": "geo_point",
                                                                                    "unit": "lat-long"
                                                                                    }
                                                                       },
                                                          "description": "ToCart",
                                                          "type": "sensor"
                                                          },

                                             "likes": {
                                                       "channels": {
                                                                    "user": {
                                                                             "type": "String",
                                                                             "unit": "id"
                                                                             },
                                                                    "location": {
                                                                                 "type": "geo_point",
                                                                                 "unit": "lat-long"
                                                                                 }
                                                                    },
                                                       "description": "Likes",
                                                       "type": "sensor"
                                                       },
                                             "dislikes": {
                                                          "channels": {
                                                                       "user": {
                                                                                "type": "String",
                                                                                "unit": "id"
                                                                                },
                                                                       "location": {
                                                                                    "type": "geo_point",
                                                                                    "unit": "lat-long"
                                                                                    }
                                                                       },
                                                          "description": "Dislikes",
                                                          "type": "sensor"
                                                          }
                                             },
                                 "customFields": {
                                                    "photo": product["photo"],
                                                    "brand": product["brand"],
                                                    "nutritional facts": product["nutritionalFacts"],
                                                    "price": product["price"],
                                                    "discount": product["discount"],
                                                    "summary": product["summary"]
                                  },
                                 "actions": [],
                                 "properties": []
                                 })
    headers = {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
    }

    request = Request(lcmEndpoint, data=product_so, headers=headers)
    request.get_method = lambda: 'POST'
    response_body = urlopen(request).read()

    data = json.loads(response_body)
    return data

def createSubscriptions(soid):
    global token
    headers = {
               "Authorization": token,
               "Content-Type": "application/json"    
    }
    
    dataUpdate = json.dumps({
                    "callback":"pubsub",
                    "destination": token
    })
    
    priceSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/price/subscriptions"
    scansSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/scans/subscriptions"
    checkinsSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/checkins/subscriptions"
    tocartSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/tocart/subscriptions"
    sharesSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/shares/subscriptions"
    likesSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/likes/subscriptions"
    dislikesSubscriptionStream = servioticyEndpoint + "/" + soid + "/streams/dislikes/subscriptions"
    
    subscriptions = [priceSubscriptionStream,tocartSubscriptionStream, sharesSubscriptionStream, scansSubscriptionStream,checkinsSubscriptionStream,likesSubscriptionStream,dislikesSubscriptionStream]
    
    for subscription in subscriptions:
        request = Request(subscription , data=dataUpdate, headers=headers)
        request.get_method = lambda: 'POST'
        response_body = urlopen(request).read()
        data = json.loads(response_body)
        print " Subscription created for Service Object: " + data["id"]
    return
    
def getSOToken(soid):
    global token

    URL      = idmEndpoint + '/idm/serviceobject/' + soid;
    headers = {
               "Authorization": "Bearer " + token,
               "Content-Type": "application/json"    
    }

    response = requests.get(URL,headers=headers)
    json = response.json()
    apiToken = json["api_token"]

    print "Service Object token retrieved " + apiToken

    return apiToken
    
def generateFakeData(soid,product):
    global soidToken
    
    soidToken = getSOToken(soid);
    currentTimestamp = int(time.time())
    currentTimestamp = currentTimestamp*1000

    updateDynamic(soid,product["price"]+0.5,currentTimestamp-300000000)
    updateDynamic(soid,product["price"]-0.75,currentTimestamp-200000000)
    updateDynamic(soid,product["price"]+0.8,currentTimestamp-100000000)
    updateDynamic(soid,product["price"],currentTimestamp)
        
    updateInteractions(soid,currentTimestamp-100000000,"anonymous","-2.9462242126464844, 43.262362457768845",1,0,2,1,4)
    updateInteractions(soid,currentTimestamp-100,"iker","-2.9462242126464844, 43.262362457768845",0,1,1,1,6)
    updateInteractions(soid,currentTimestamp,"vlad","-2.9462242126464824, 43.262362457768845",1,0,3,0,4)

    return
    
def updateStream(stream,dataUpdate):
    headers = {
               "Authorization": soidToken,
               "Content-Type": "application/json"
    }
    request = Request(stream, data=dataUpdate, headers=headers)
    request.get_method = lambda: 'PUT'
    response_body = urlopen(request).read()

    return

def updateDynamic(soid,price,timestamp):
    priceStream = servioticyEndpoint + "/" + soid + "/streams/price"
    priceUpdate = json.dumps({
                               "channels": {
                                            "value": {
                                                      "current-value": price
                                                     },
                                           },
                               "lastUpdate": timestamp
                              })
    print ' Sending price update: ', price
    updateStream(priceStream,priceUpdate)
    return

def updateInteractions(soid, timeStamp,user,location,nLikes,nDislikes,nCheckins,nShare,nCart):

    scansStream = servioticyEndpoint + "/" + soid + "/streams/scans"
    checkinsStream = servioticyEndpoint + "/" + soid + "/streams/checkins"
    likesStream = servioticyEndpoint + "/" + soid + "/streams/likes"
    dislikesStream = servioticyEndpoint + "/" + soid + "/streams/dislikes"
    sharesStream = servioticyEndpoint + "/" + soid + "/streams/shares"
    tocartStream = servioticyEndpoint + "/" + soid + "/streams/tocart"
    
    valuesUpdate = json.dumps({
                                "channels": {
                                              "user": {
                                                       "current-value": user,
                                                      },
                                              "location": {
                                                          "current-value": location,                    
                                                          }
                                            },
                                   "lastUpdate": timeStamp
                                   })

    for i in range(0,nCheckins):
        print ' Sending checkins update: ', user
        updateStream(checkinsStream,valuesUpdate)

    for i in range(0,nLikes):
        print ' Sending likes update: ', user
        updateStream(likesStream,valuesUpdate)

    for i in range(0,nDislikes):
        print ' Sending dislikes update: ', user
        updateStream(dislikesStream,valuesUpdate)

    for i in range(0,nShare):
        print ' Sending shares update: ', user
        updateStream(sharesStream,valuesUpdate)

    for i in range(0,nCart):
        print ' Sending tocart update: ', user
        updateStream(tocartStream,valuesUpdate)
    
    return  

def createIDMGroup(name):
    global token
    
    URL = idmEndpoint + '/idm/group/';
    idmData = '{"name":"'+name+'"}'    
    headers = {
               "Authorization": "Bearer " + token,
               "Content-Type": "application/json;charset=UTF-8"
    }
    
    response = requests.post(URL, data=idmData,headers=headers)        
    return response.json()

def getGroupId(name):
    global token
    
    URL = idmEndpoint + '/idm/group/?page=1';
    headers = {
               "Authorization": "Bearer " + token,
               "Content-Type": "application/json;charset=UTF-8"
    }

    response = requests.get(URL, headers=headers)        
    return response.json()

def getUserId(username):
    global token
    
    URL = idmEndpoint + '/idm/user/info/'
    headers = {
               "Authorization": "Bearer " + token,
               "Content-Type": "application/json;charset=UTF-8"
    }
    
    response = requests.get(URL, headers=headers)                
    return response.json()
    
def createMembership(groupId, userId):
    global token

    URL = idmEndpoint + '/idm/memberships/user/' + userId + "/";
    idmData = '{"group_id":"' + groupId + '", "role":"ADMIN"}' 
    headers = {
               "Authorization": "Bearer " + token,
               "Content-Type": "application/json;charset=UTF-8"
    }
    
    response = requests.post(URL, data=idmData, headers=headers)        
    return response.json()        

def addUserToGroup(user, groupId):    
    response = getUserId(user)
    userId = response["id"]
    response = createMembership(groupId, userId)
    return response

def addSOToGroup(soid,groupId):
    global token
    
    URL = idmEndpoint + '/idm/group_memberships/serviceobject/' + soid + '/';

    idmData = '{"group_id":"' + groupId +'"}'    
    headers = {
               "Authorization": "Bearer " + token,
               "Content-Type": "application/json;charset=UTF-8"
    }
    
    response = requests.post(URL, data=idmData,headers=headers)            
    return response.json()

def createModelReference(soURI, model):
    headers = {
            "Accept": "application/json"
    }
    query_args = { 'property':'http://www.w3.org/ns/sawsdl#modelReference', 'value': model }
    encoded_args = urllib.urlencode(query_args)
    url = soURI + '/properties/?' + encoded_args

    request = Request(url, data="", headers=headers)
    request.get_method = lambda: 'POST'
    response_body = urlopen(request).read()
    data = json.loads(response_body)
    return
