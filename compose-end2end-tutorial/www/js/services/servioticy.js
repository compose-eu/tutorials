angular.module('compose.servioticy', [
    'compose.configuration'
])
    .factory('servioticy',
    ['configuration',
        function (configuration) {
            var factory = {};

            factory.doHTTP = function (method, token, postData, url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open(method, url);
                if (token)
                    xhr.setRequestHeader("Authorization", token);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        var response = JSON.parse(this.responseText);
                        callback(response);
                    }
                };
                xhr.send(postData);
            };

            factory.getSOInfo = function (soId, success, error) {
                if (configuration.accessToken) {
                    var url = configuration.servioticySOInfo + soId;
                    factory.doHTTP("GET", configuration.accessToken, null, url, function (result) {
                        if (result["id"]) {
                            success(result);
                        }
                        else {
                            console.log("Error retrieving the SO " + result);
                            error();
                        }
                    });
                }
                else {
                    console.log("Access Token not available");
                }
            };

            factory.updateStream = function (soId, stream, data, success, error) {
                if (configuration.apiTokens[soId]) {
                    var url = configuration.getStreamURL(soId, stream);
                    factory.doHTTP("PUT", configuration.apiTokens[soId], data, url, function (result) {
                        if (result["channels"]) {
                            success(result);
                        }
                        else {
                            console.log("Error retrieving the SO " + result);
                            error();
                        }
                    });
                }
                else {
                    console.log("Access Token not available");
                }
            }
            return factory;
        }
    ]
);

