#!/usr/bin/python
# -*- coding: latin-1 -*-

from requests.auth import HTTPDigestAuth
import getpass

import configuration
from compose import *
from products import *

global token

#GET USER TOKEN FROM IDM
user = raw_input('Enter your username: ')
password = getpass.getpass()
token = getToken(user,password)
addToPremium = True

print ("COMPOSE Token: " + token)

for product in products:
        try:
            product["nutritionalFacts"] = json.dumps(product["nutritionalFacts"])
        except KeyError:
            product["nutritionalFacts"] = ""

        soData = createSO(product)
        soid = soData["id"]
        if soid:
            print "Service Object created: " + soid

        createModelReference(soData["catalog"], product["model"])

        createSubscriptions(soid)

        generateFakeData(soid,product)

        if (addToPremium):
            response = addSOToGroup(soid, premiumGroupId)
            if 'lastModified' in response:
                print "Product added to premium group"

        addToPremium = not addToPremium

print " "
print "DONE"