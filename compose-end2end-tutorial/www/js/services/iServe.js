angular.module('compose.iServe', [
    'compose.configuration', 'compose.servioticy'
])

    .factory('iServe', [
        'configuration', 'idm', function (configuration, idm) {
            var factory = {};

            factory.doHTTP = function (method, authRequired, postData, url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open(method, url);
                if (authRequired)
                    xhr.setRequestHeader("Authorization", "Bearer " + configuration.accessToken);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("Accept", "application/json");

                xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        var response = JSON.parse(this.responseText);
                        callback(response);
                    }
                };
                xhr.send(postData);
            };

            factory.semanticSearch = function (category, success, error) {
                var url = configuration.iServeDiscovery;

                var queryData = {
                    discovery: {
                        "func-rdfs": {
                            classes: {
                                or: ["http://www.productontology.org/id/" + category]
                            },
                            type: "svc",
                            "matching": "subsume"
                        }
                    }
                }
                console.log(queryData);

                factory.doHTTP("POST", false, JSON.stringify(queryData), url, function (response) {
                    console.log(response);
                    if (Object.keys(response).length === 0) {
                        console.log("No matches found");
                    }

                    for (var service in response) {
                        var soid = response[service]["description"].split(" ").splice(-1);
                        idm.getSOInfo(soid, function (soInfo) {
                            success(soInfo);
                        }, function (error) {
                            console.log("There was an error retrieving SO info");
                        });
                    }
                });
            };

            return factory;
        }
    ]);
