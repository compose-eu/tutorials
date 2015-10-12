angular.module('compose.configuration', [])
    .factory('configuration',
    ['$rootScope',
        function ($rootScope) {
            var factory = {};

            factory.servioticyEndpoint = 'http://api.servioticy.com:9090';
            factory.servioticySOInfo = factory.servioticyEndpoint + '/';

            factory.idmEndpoint = 'http://idm4.147.83.30.133.xip.io';
            factory.idmUserAuthentication = factory.idmEndpoint + '/auth/user/';
            factory.idmGroupEntities = factory.idmEndpoint + '/idm/group_entities/';
            factory.idmSOInfo = factory.idmEndpoint + '/idm/serviceobject/';

            factory.premiumGroupId = 'b189fd0f-f552-48bc-a6d6-78c5dae1c94b';

            factory.iServeEndpoint = 'http://compose.bsc.es:9082';
            factory.iServeDiscovery = factory.iServeEndpoint + '/iserve/discovery/';

            factory.composeApplication = {
                interactions: "http://f4a537501fad4cadba2b8ea23ef4a186.147.83.30.133.xip.io/api/interactions",
                sentiment: "http://f4a537501fad4cadba2b8ea23ef4a186.147.83.30.133.xip.io/api/sentiment",
                price: "http://f4a537501fad4cadba2b8ea23ef4a186.147.83.30.133.xip.io/api/price",
                map: "http://f4a537501fad4cadba2b8ea23ef4a186.147.83.30.133.xip.io/api/map"
            };

            factory.apiTokens = {};
            factory.accessToken = "";

            factory.getStreamURL = function (soId, stream) {
                return factory.servioticyEndpoint + "/" + soId + "/streams/" + stream;
            }

            return factory;
        }
    ]
);