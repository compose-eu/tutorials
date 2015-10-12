#!/usr/bin/python
# -*- coding: latin-1 -*-

from requests.auth import HTTPDigestAuth

import configuration
from compose import *
from products import *

global token

#GET USER TOKEN FROM IDM
user = raw_input('Enter your username: ')
password = getpass.getpass()

token = getToken(user,password)
print "User Token: " +  token
print " "

response = createIDMGroup(premiumGroupName)
if 'id' in response:
    premiumGroupId = response["id"]
print "Group Id " + premiumGroupId    
response = addUserToGroup(user, premiumGroupId)
print response
print " "

response = createIDMGroup(retailGroupName)
if 'id' in response:
    retailGroupId = response["id"]
print "Group Id " + retailGroupId    
response = addUserToGroup(user, retailGroupId)
print response
print " "

print " "
print "DONE"