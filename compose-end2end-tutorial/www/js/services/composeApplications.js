angular.module('compose.applications', [
    'compose.configuration'
])
    .factory('composeApplications',
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

            factory.invokeApplication = function (url, token, postData, resultObject, success, error) {
                if (token) {
                    factory.doHTTP("POST", token, postData, url, function (result) {
                        if (result[resultObject]) {
                            success(result);
                        }
                        else {
                            error(result);
                        }
                    });
                }
                else {
                    console.log("Access Token not available");
                }
            };

            factory.getInteractions = function (soId, token, success, error) {
                var url = configuration.composeApplication.interactions;
                var postData = {
                    soid: soId
                }
                factory.invokeApplication(url, token, JSON.stringify(postData),"interactions", success, error);
            };

            factory.getSentiment = function (soId, token, success, error) {
                var url = configuration.composeApplication.sentiment;
                var postData = {
                    soid: soId
                }
                factory.invokeApplication(url, token, JSON.stringify(postData),"sentiment", success, error);
            }

            factory.getPrice = function (soId, token, success, error) {
                var url = configuration.composeApplication.price;
                var postData = {
                    soid: soId
                }
                factory.invokeApplication(url, token, JSON.stringify(postData), "price", success, error);
            }

            factory.getMap = function (soId, token, success, error) {
                var url = configuration.composeApplication.map;
                var postData = {
                    soid: soId
                }
                factory.invokeApplication(url, token, JSON.stringify(postData), "map", success, error);
            }

            return factory;
        }
    ]
);

