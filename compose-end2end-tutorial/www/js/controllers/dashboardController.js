'use strict';

angular.module('compose').controller('dashboardController', [
    '$scope', '$stateParams', '$location', 'idm', 'composeApplications', 'configuration', 'servioticy', function ($scope, $stateParams, $location, idm, composeApplications, configuration, servioticy) {
        var soid = $stateParams.soid;

        $scope.title = 'Product';
        $scope.product = {};

        $scope.interactions = [];
        $scope.sentiment = {};
        $scope.max = 5; // stars

        var onError = function (error) {
            console.log("Error: " + error);
        }

        var onInteractions = function (result) {
            $scope.interactions = result.interactions;
            $scope.$apply();

            $scope.displayInteractions();
        }

        var onSentiment = function (result) {
            $scope.sentiment = result.sentiment;
            $scope.stars = $scope.sentiment.stars;
            $scope.product.likes = $scope.sentiment.data.likes;
            $scope.product.dislikes = $scope.sentiment.data.dislikes;
            $scope.interactions = result.interactions.data;
            $scope.$apply();

            $scope.displayInteractions();
        }

        var onPrice = function (result) {
            $scope.priceHistory = result.price;
            $scope.product.price = result["price"][result["price"].length - 1][1];
            $scope.$apply();

            $scope.displayPrice();
        }

        var onMap = function (result) {
            $scope.map = result.map;
            $scope.$apply();

            $scope.displayMap();
        }

        var onGetSOInfo = function (soInfo) {
            var nF = JSON.parse(soInfo['customFields']['nutritional facts']);
            $scope.product = {
                name: soInfo['name'],
                description: soInfo['description'],
                image: soInfo['customFields']['photo'],
                price: "",
                soid: soInfo['id'],
                brand: soInfo['customFields']['brand'],
                summary: soInfo['customFields']['summary'],
                salt: nF['salt'],
                calories: nF['calories'],
                fat: nF['fat'],
                sugar: nF['sugar'],
                carbs: nF['carbs'],
                saturatedFat: nF['saturatedFat'],
                protein: nF['protein']
            };
            $scope.$apply();

            composeApplications.getInteractions(soInfo['id'], configuration.accessToken, onInteractions, onError);
            composeApplications.getSentiment(soInfo['id'], configuration.accessToken, onSentiment, onError);
            composeApplications.getPrice(soInfo['id'], configuration.accessToken, onPrice);
            composeApplications.getMap(soInfo['id'], configuration.accessToken, onMap);
        };

        // Authentication to be removed
        $scope.username = 'iker@evrythng.com';
        $scope.password = 'compose';
        idm.authenticate($scope.username, $scope.password, function () {
            idm.getSOInfo(soid, onGetSOInfo, function (error) {
                console.log("There was an error retrieving the product info");
            });
        }, function () {
            $window.alert("Authentication failed! Check your credentials.");
        });

        var onPriceUpdate = function (result) {
            console.log("Price updated " + result);
        }

        $scope.updatePrice = function () {
            var onSuccess = function (position) {
                var newPriceInt = parseFloat($scope.product.price);
                var location = position.coords.latitude + ", " + position.coords.longitude;
                var streamUpdate = {
                    "channels": {
                        "value": {
                            "current-value": newPriceInt
                        }
                    },
                    "lastUpdate": position.timestamp
                };
                servioticy.updateStream($stateParams.soid, "price", JSON.stringify(streamUpdate), onPriceUpdate, onError);
            }
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }

        $scope.displayPrice = function () {
            $scope.priceChartConfig = {
                options: {
                    chart: {
                        type: 'line',
                        backgroundColor: 'white',
                        borderRadius: 0
                    }
                },
                series: [
                    {
                        name: 'Price',
                        type: 'line',
                        pointWidth: 20,
                        data: $scope.priceHistory,
                        color: 'blue',
                        lineWidth: 2,
                        pointInterval: 24 * 3600 * 1000, // one day
                    }
                ],
                title: {
                    text: '',
                    align: 'left',
                    style: {
                        color: 'black'
                    }
                },
                legend: {
                    verticalAlign: 'bottom',
                    borderWidth: 0,
                    itemStyle: {
                        color: 'black'
                    }
                },
                xAxis: {
                    type: 'datetime',

                    dateTimeLabelFormats: {
                        day: '%b %e',
                        hour: ' '
                    },
                    labels: {
                        style: {
                            color: 'black'
                        }
                    }
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        style: {
                            color: 'black'
                        }
                    },
                    min: 0
                },
                size: {
                    width: 700,
                    height: 245
                },
                loading: false
            }

        }

        $scope.displayInteractions = function () {
            $scope.interactionChartConfig = {
                options: {
                    chart: {
                        type: 'spline',
                        backgroundColor: 'white',
                        borderRadius: 0,
                        renderTo: 'container'
                    }
                },
                exporting: {
                    enabled: false,
                    buttons: {
                        contextButton: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        name: 'Scans',
                        type: 'spline',
                        pointWidth: 20,
                        data: $scope.interactions.scans,
                        color: '#f35c59',
                        lineWidth: 2,
                        dataGrouping: {
                            approximation: "sum",
                            enabled: true,
                            forced: true,
                            units: [
                                [
                                    'day', [
                                    1
                                ]
                                ]
                            ]

                        },
                        pointInterval: 24 * 3600 * 1000, // one day
                        // marker : {
                        // enabled : true,
                        // radius : 4
                        // }
                    }, {
                        name: 'Check-ins',
                        data: $scope.interactions.checkins,
                        type: 'spline',
                        color: '#b1c200',
                        pointWidth: 20,
                        lineWidth: 2,
                        dataGrouping: {
                            approximation: "sum",
                            enabled: true,
                            forced: true,
                            units: [
                                [
                                    'day', [
                                    1
                                ]
                                ]
                            ]

                        },
                        pointInterval: 24 * 3600 * 1000, // one day
                        // marker : {
                        // enabled : true,
                        // radius : 4
                        // }
                    }, {
                        name: 'To cart',
                        data: $scope.interactions.tocart,
                        type: 'spline',
                        color: 'blue',
                        pointWidth: 20,
                        lineWidth: 2,
                        dataGrouping: {
                            approximation: "sum",
                            enabled: true,
                            forced: true,
                            units: [
                                [
                                    'day', [
                                    1
                                ]
                                ]
                            ]

                        },
                        pointInterval: 24 * 3600 * 1000, // one day
                        // marker : {
                        // enabled : true,
                        // radius : 4
                        // }
                    }, {
                        name: 'Shares',
                        data: $scope.interactions.shares,
                        type: 'spline',
                        color: 'black',
                        pointWidth: 20,
                        lineWidth: 2,
                        dataGrouping: {
                            approximation: "sum",
                            enabled: true,
                            forced: true,
                            units: [
                                [
                                    'day', [
                                    1
                                ]
                                ]
                            ]

                        },
                        pointInterval: 24 * 3600 * 1000, // one day
                        // marker : {
                        // enabled : true,
                        // radius : 4
                        // }
                    }
                ],
                title: {
                    text: '',
                    align: 'left',
                    style: {
                        color: 'black'
                    }
                },
                legend: {
                    verticalAlign: 'bottom',
                    borderWidth: 0,
                    itemStyle: {
                        color: 'black'
                    }
                },
                xAxis: {
                    type: 'datetime',

                    dateTimeLabelFormats: {
                        day: '%b %e',
                        hour: ' '
                    },
                    labels: {
                        style: {
                            color: 'black'
                        }
                    }
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        style: {
                            color: 'black'
                        }
                    },
                    min: 0
                },
                size: {
                    width: 1000,
                    height: 245
                }
            }
        }

        $scope.displayMap = function () {
            $scope.interactionsMapConfig = {
                options: {
                    legend: {
                        enabled: true
                    },
                    plotOptions: {
                        map: {
                            mapData: Highcharts.maps['countries/gb/gb-all'],
                            joinBy: [
                                'name'
                            ]
                        }
                    },
                },
                chartType: 'map',
                title: {
                    text: ''
                },
//						size : {
//							width : 700,
//							height : 245
//						},
//						legend : {
//							verticalAlign : 'bottom',
//							borderWidth : 0,
//							itemStyle : {
//								color : 'black'
//							}
//						},
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

//						tooltip : {
//							headerFormat : '',
//							pointFormat : '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
//						},

                series: [
                    {
                        mapData: Highcharts.maps['countries/gb/gb-all'],
                        name: 'Basemap',
                        borderColor: '#A0A0A0',
                        nullColor: 'rgba(200, 200, 200, 0.3)',
                        showInLegend: false
                    }, {
                        name: 'Separators',
                        type: 'mapline',
                        data: Highcharts.geojson(Highcharts.maps['countries/gb/gb-all'], 'mapline'),
                        color: '#707070',
                        showInLegend: false,
                        enableMouseTracking: false
                    }, {
                        // Specify points using lat/lon
                        type: 'mappoint',
                        name: 'Scans',
                        color: Highcharts.getOptions().colors[0],
                        data: $scope.map.scans
                    }, {
                        // Specify points using lat/lon
                        type: 'mappoint',
                        name: 'Check-ins',
                        color: Highcharts.getOptions().colors[1],
                        data: $scope.map.checkins
                    }, {
                        // Specify points using lat/lon
                        type: 'mappoint',
                        name: 'Shares',
                        color: Highcharts.getOptions().colors[2],
                        data: $scope.map.shares
                    }, {
                        // Specify points using lat/lon
                        type: 'mappoint',
                        name: 'To cart',
                        color: Highcharts.getOptions().colors[3],
                        data: $scope.map.tocart
                    }
                ]
            };
        }

    }
]);