angular.module('compose.idm', [
    'compose.configuration',
    'compose.servioticy'
]).factory('idm', [
    'configuration',
    'servioticy',
    function (configuration, servioticy) {

        var factory = {};

        factory.username = "unknown";

        factory.doHTTP = function (method, authRequired, postData, url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);

            if (authRequired)
                xhr.setRequestHeader("Authorization", "Bearer " + configuration.accessToken);

            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    var response = JSON.parse(this.responseText);
                    callback(response);
                }
            };

            xhr.send(postData);
        };

        factory.getUsername = function(){
            return this.username;
        };

        factory.authenticate = function (username, password, success, error) {
            // GET USER TOKEN from IDM
            var authData = {
                username: username,
                password: password
            };

            var authenticationURL = configuration.idmUserAuthentication;

            factory.doHTTP("POST", false, JSON.stringify(authData), authenticationURL, function (result) {
                if (result["accessToken"]) {
                    console.log("Access token " + result["accessToken"]);

                    factory.username = username;

                    // SAVE token in the configuration object
                    configuration.accessToken = result["accessToken"];
                    success();
                }
                else {
                    console.log("Authentication failed");
                    error();
                }
            });
        };

        factory.getGroupId = function (groupName) {
            if (groupName === 'premium-offers') {
                return configuration.premiumGroupId;
            }
        };

        factory.getSOInfo = function (soid, success, error) {
            if (configuration.accessToken) {
                var url = configuration.idmSOInfo + soid;
                factory.doHTTP("GET", true, null, url, function (result) {
                    if (result["api_token"]) {
                        configuration.apiTokens[result['id']] = result['api_token'];

                        console.log("API Token for " + result['id'] + " is " + configuration.apiTokens[result['id']]);

                        servioticy.getSOInfo(result['id'], function (soInfo) {
                            success(soInfo);
                        }, function (error) {
                            console.log("There was an error retrieving SO info");
                        });
                    }
                    else {
                        console.log("Error retrieving the SO " + result);
                        error(result);
                    }
                });
            }
            else {
                console.log("User token not found, authenticate again");
            }
        }

        factory.getSOFromGroup = function (groupName, success, error) {
            if (configuration.accessToken) {
                var groupId = factory.getGroupId(groupName);
                var url = configuration.idmGroupEntities + groupId + "/";
                factory.doHTTP("GET", true, null, url, function (result) {
                    if (result["approvedMemberships"]) {
                        var objects = result["approvedMemberships"];
                        for (var so in objects) {
                            var soId = objects[so]["entity_id"];
                            factory.getSOInfo(soId, success, error);
                        }
                    }
                    else {
                        console.log("Error retrieving the group" + result);
                        error();
                    }
                });
            }
            else {
                console.log("User token not found, authenticate again");
            }
        }
        return factory;
    }
]);
