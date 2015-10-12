'use strict';

//Sample categories taken from GoodRelations
var productCategories = [
    {"name": "Water"},
    {"name": "Detergent"},
    {"name": "Cookie"},
    {"name": "Juice"},
    {"name": "Ice_cream"},
    {"name": "Potato"},
    {"name": "Yogurt"}
];

productCategories = productCategories.sort(function (a, b) {
    var catA = a.name.toLowerCase();
    var catB = b.name.toLowerCase();
    if (catA > catB)
        return 1;
    if (catA < catB)
        return -1;
    return 0;
});

angular.module('compose')
    .factory('ProductCategoryDataService',
    function ($q, $timeout) {

        var searchCategories = function (searchFilter) {
            console.log('Searching products for ' + searchFilter);
            var matches = productCategories
                .filter(function (productCategory) {
                    if (productCategory.name.toLowerCase().indexOf(
                            searchFilter.toLowerCase()) !== -1)
                        return true;
                });
            return matches;
        };
        return {
            searchCategories: searchCategories
        }
    })
    .controller('menuController',
    ['$rootScope', '$scope', '$state', '$location', 'ProductCategoryDataService',

        function ($rootScope, $scope, $state, $location, ProductCategoryDataService) {

            $scope.matches = [];

            $scope.data = {"categories": ''};

            $scope.callbackMethod = function (query) {
                return ProductCategoryDataService.searchCategories(query);
            };

            $scope.loadOffers = function () {
                $state.go('offers');
            };

            $scope.semanticSearch = function () {
                $rootScope.categories = $scope.data.categories;
                $state.go('search');
            };

            $scope.back = function () {
                $state.go('login');
            };

        }] );