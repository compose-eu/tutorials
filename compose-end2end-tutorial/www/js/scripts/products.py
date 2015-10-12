#!/usr/bin/python
# -*- coding: latin-1 -*-
import json

products = json.loads("""
[ 
    { 
        "nutritionalFacts" : 
            {   
                "sugar": "<1%", 
                "calories" : "1.3", 
                "fat": "0", 
                "salt": "0",
                "carbs": "2",
                "saturatedFat" : "3",
                "protein" : "3" 
            }, 
        "ean": "5410041169607", 
        "name": "Prince START Naturel New",
        "summary" : "Chocolate chips",
        "description" : "LU Prince Biscuits with Cocoa creme filling are made with a cocoa cream filling between two crip flavoured biscuits.",
        "brand": "LU", 
        "price": 2.00, 
        "photo": "http://proddb.kraft-hosting.net/prod_db/proddbimg/31536.png", 
        "discount": "10%",
        "model": "http://www.productontology.org/id/Cookie"
    },
    {
            "nutritionalFacts" :
                {
                    "sugar": "<1%",
                    "calories" : "1.3",
                    "fat": "0",
                    "salt": "0",
                    "carbs": "2",
                    "saturatedFat" : "3",
                    "protein": "4"
                },
            "ean": "8001120883032",
            "name": "Yogurt Bianco Probiotico Coop Bene-si 0.1",
            "description": "Yogurt Bianco Probiotico Coop Bene-si 0.1",
            "summary" : "Diary Product",
            "brand": "Coop",
            "price": 2.85,
            "photo": "http://www.e-coop.it/documents/10180/137038/probiotico-bianco.jpg/238f8595-8b3a-40a8-b465-5dd4998f8438?t=1365502216815&imagePreview=1",
            "discount": "10%",
            "model": "http://www.productontology.org/id/Yogurt"
        }
]""", encoding="latin-1");