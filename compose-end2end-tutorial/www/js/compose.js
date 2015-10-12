// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var app = angular.module('compose', [
    'ionic',
    'compose.idm',
    'compose.servioticy',
    'compose.iServe',
    'compose.applications',
    'ionic.rating',
    'ion-autocomplete',
    'highcharts-ng'
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login')

        $stateProvider.state('login', {
            url: '/login',
            controller: 'loginController',
            templateUrl: 'views/login.html'
        }).state('menu', {
            url: '/menu',
            controller: 'menuController',
            templateUrl: 'views/menu.html'
        }).state('product', {
            url: '/product/:soid',
            controller: 'productController',
            templateUrl: 'views/product.html'
        }).state('search', {
            url: '/search',
            controller: 'searchController',
            templateUrl: 'views/search.html'
        }).state('offers', {
            url: '/offers',
            controller: 'offersController',
            templateUrl: 'views/offers.html'
        }).state('dashboard', {
            url: '/dashboard/:soid',
            controller: 'dashboardController',
            templateUrl: 'views/dashboard.html'
        })
    })

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    });
