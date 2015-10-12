'use strict';

angular.module('compose')
    .controller('searchController',
    ['$rootScope', '$scope', '$state', '$stateParams', 'iServe', '$timeout',
        function ($rootScope, $scope, $state, $stateParams, iServe, $timeout) {
            $scope.title = 'Search Results';
            $scope.noMoreItemsAvailable = false;
            $scope.items = [];

            console.log($rootScope.categories);

            $scope.addItem = function (soInfo) {
                $timeout(function () {
                    $scope.items.push({
                        name: soInfo['name'],
                        description: soInfo['description'],
                        image: soInfo['customFields']['photo'],
                        price: soInfo['customFields']['price'],
                        soid: soInfo['id']
                    });
                    $scope.$apply();
                });
            };

            for (var category in $rootScope.categories) {
                console.log("Semantic search for " + $rootScope.categories[category]);
                iServe.semanticSearch($rootScope.categories[category], $scope.addItem, function (result) {
                    console.log(result);
                });
            }

            $scope.back = function () {
                $state.go('menu');
            };
        }
    ]);