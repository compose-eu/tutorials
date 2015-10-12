'use strict';

angular.module( 'compose' ).controller( 'offersController', [
		'$scope', '$state','idm', function ( $scope, $state, idm ) {
			$scope.title = 'Your Premium Offers';
			$scope.noMoreItemsAvailable = false;
			$scope.items = [];
			
			$scope.addItem = function ( soInfo ) {
				$scope.items.push( {					
					name : soInfo['name'],
					description : soInfo['description'],
					image : soInfo['customFields']['photo'],
					price: soInfo['customFields']['price'],
					discount: soInfo['customFields']['discount']
				} );
				$scope.$apply();
			};

			$scope.back = function () {
				$state.go('menu');
			};

			idm.getSOFromGroup( 'premium-offers', $scope.addItem, function ( result ) {
				console.log( result );
			} );

		}
] );