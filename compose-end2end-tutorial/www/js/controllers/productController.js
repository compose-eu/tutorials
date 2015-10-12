'use strict';

angular.module( 'compose' ).controller( 'productController', [
		'$scope', '$state', '$stateParams', '$window', 'idm', 'configuration', 'composeApplications', 'servioticy',
		function ( $scope, $state, $stateParams, $window, idm, configuration, composeApplications, servioticy ) {
			var soid = $stateParams.soid;

			$scope.title = 'Product';
			$scope.product = {};
			
			$scope.isLikeDisabled = false;
			$scope.isDislikeDisabled = false;
			$scope.isCheckinDisabled = false;
			$scope.isTocartDisabled = false;
			$scope.isShareDisabled = false;

			$scope.interactions = [];
			$scope.sentiment = {};
			$scope.max = 5; // stars

			$scope.back = function () {
				$state.go('search');
			};

			var onError = function ( error ) {
				console.log( "Error: " + error );
			}

			var onSentiment = function ( result ) {
				$scope.sentiment = result.sentiment;
				$scope.stars = $scope.sentiment.stars;
				$scope.product.likes = $scope.sentiment.data.likes;
				$scope.product.dislikes = $scope.sentiment.data.dislikes;
				$scope.interactions = result.interactions.data;						
				$scope.$apply();
				
				$scope.displayInteractions();
			}

			var onPrice = function ( result ) {
				$scope.priceHistory = result.price;
				$scope.product.price = result["price"][result["price"].length-1][1];
				$scope.$apply();

				$scope.displayPrice();
			}

			var onGetSOInfo = function ( soInfo ) {
				var nF = JSON.parse( soInfo[ 'customFields' ][ 'nutritional facts' ] );
				$scope.product = {
					name : soInfo[ 'name' ],
					description : soInfo[ 'description' ],
					image : soInfo[ 'customFields' ][ 'photo' ],
					price : "",
					soid : soInfo[ 'id' ],
					brand : soInfo[ 'customFields' ][ 'brand' ],
					summary : soInfo[ 'customFields' ][ 'summary' ],
					salt : nF[ 'salt' ],
					calories : nF[ 'calories' ],
					fat : nF[ 'fat' ],
					sugar : nF[ 'sugar' ],
					carbs : nF[ 'carbs' ],
					saturatedFat : nF[ 'saturatedFat' ],
					protein : nF[ 'protein' ]
				};
				$scope.$apply();
				
				composeApplications.getSentiment( soInfo[ 'id' ], configuration.accessToken, onSentiment, onError );
				composeApplications.getPrice( soInfo[ 'id' ], configuration.accessToken, onPrice );
			};

			idm.getSOInfo( soid, onGetSOInfo, function ( error ) {
				console.log( "There was an error retrieving the product info" );
			} );

			var onStreamUpdate = function (result){
				composeApplications.getSentiment( $scope.product.soid, configuration.accessToken, onSentiment, onError );
			}
			
			var updateStream = function(stream){
				var onSuccess = function(position) {					
					var location = position.coords.latitude + ", " + position.coords.longitude;						
					var streamUpdate = {
					     "channels": {
					         "user": {
				                    "current-value": idm.getUsername()
				              },
				              "location": {
				                	"current-value": location
				              }
					       },
					       "lastUpdate": position.timestamp
					};
					servioticy.updateStream($stateParams.soid,stream,JSON.stringify(streamUpdate),onStreamUpdate, onError);
				}				
				navigator.geolocation.getCurrentPosition(onSuccess, onError);
			}
			
			$scope.like = function(){
				updateStream("likes");
				$scope.isLikeDisabled = true;
			}
			
			$scope.dislike = function(){
				updateStream("dislikes");
				$scope.isDislikeDisabled = true;
			}
			
			$scope.share = function(){
				updateStream("shares");
				$scope.isShareDisabled = true;
			}
			
			$scope.checkin = function(){
				updateStream("checkins");
				$scope.isCheckinDisabled = true;
			}
			
			$scope.tocart = function(){
				updateStream("tocart");
				$scope.isTocartDisabled = true;
			}			

			$scope.displayInteractions = function () {
				$scope.interactionChartConfig = {
					options : {
						chart : {
							type : 'column',
							backgroundColor : 'white',
							borderRadius : 0,
							renderTo : 'container'
						}
					},
					series : [
							{
								name : 'Total Interactions',
								colorByPoint: true,
								type : 'column',
								pointWidth : 20,
								data : $scope.interactions,
								dataLabels: {
					                enabled: true,
					                rotation: -90,
					                color: '#FFFFFF',
					                align: 'right',
					                format: '{point.y:.1f}', // one decimal
					                y: 10, // 10 pixels down from the top
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif'
					                }
					            },
								color : '#f35c59',
								lineWidth : 2,
							},
					],
					title : {
						text : 'Product Interactions',
						align : 'left',
						style : {
							color : 'black'
						}
					},
					legend : {
						verticalAlign : 'bottom',
						borderWidth : 0,
						itemStyle : {
							color : 'black'
						}
					},
					xAxis : {
						type : 'category',
						labels : {
							rotation: -45,
							style : {
								color : 'black'
							}
						}
					},
					yAxis : {
						title : {
							enabled : false
						},
						labels : {
							style : {
								color : 'black'
							}
						},
						min : 0
					},
					size : {
						width : 300,
						height : 235
					}
				}
			};

			$scope.displayPrice = function () {
				$scope.priceChartConfig = {
					options : {
						chart : {
							type : 'line',
							backgroundColor : 'white',
							borderRadius : 0
						}
					},
					series : [
						{
							name : 'Price',
							type : 'line',
							pointWidth : 20,
							data : $scope.priceHistory,
							color : 'blue',
							lineWidth : 2,
							pointInterval : 24 * 3600 * 1000, // one day
						}
					],
					title : {
						text : 'Product Evolution',
						align : 'left',
						style : {
							color : 'black'
						}
					},
					legend : {
						verticalAlign : 'bottom',
						borderWidth : 0,
						itemStyle : {
							color : 'black'
						}
					},
					xAxis : {
						type : 'datetime',

						dateTimeLabelFormats : {
							day : '%b %e',
							hour : ' '
						},
						labels : {
							style : {
								color : 'black'
							}
						}
					},
					yAxis : {
						title : {
							enabled : false
						},
						labels : {
							style : {
								color : 'black'
							}
						},
						min : 0
					},
					size : {
						width : 300,
						height : 235
					},
					loading : false
				}
			}
		}
] );