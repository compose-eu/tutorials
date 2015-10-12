'use strict';

angular.module('compose')

.controller( 'loginController', 
		['$scope', '$state', 'idm', '$window', 
		 function ( $scope, $state, idm, $window ) {

			$scope.doLogin = function (username,password) {
				idm.authenticate( username, password, function () {
							$state.go( 'menu' );
						}, 
						function() {
							$window.alert( "Authentication failed! Check your credentials." );
						}
				);
			}
		}
] );