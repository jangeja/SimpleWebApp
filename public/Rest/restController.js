app.controller('restController',
   ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', '$stateParams', '$rootScope',
function($scope, $state, $http, $uibM, nDlg, $stateParams, $rootScope) {

   $rootScope.location = "Rest";
   $scope.url = 'http://food2fork.com/api/search?key=da9eeba2a2590609b3449229a2af9230&sort=t';
   $scope.method = 'GET';
   $scope.send = function() {
      var sendData = {
         url: $scope.url,
         headers: $scope.headers,
         auth: $scope.auth,
         method: $scope.method,
         body: $scope.body
      };
      return $http.post('/Proxy', sendData)
      .then(function(response) {
         console.log(response);

         $scope.response = response;
      });
   };
}]);
