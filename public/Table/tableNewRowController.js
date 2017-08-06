app.controller('tableNewRowController',
   ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', '$stateParams',
   'language', 'errMap', '$rootScope',
function($scope, $state, $http, $uibM, nDlg, $stateParams,
   language, errMap, $rootScope) {

   $rootScope.location = $rootScope.location + " New Row";

   $scope.column4 = new Date();
   $scope.column4.setMinutes($scope.column4.getMinutes() - $scope.column4.getTimezoneOffset());
   $scope.column5Date = new Date();
   $scope.column5Date.setMinutes($scope.column5Date.getMinutes() - $scope.column5Date.getTimezoneOffset());
   $scope.valid = false;
   var booleans = ['true', 'false', false, true];

   $scope.validate = function() {
      if (($scope.column5Time && !$scope.column5Time.match("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")) ||
         (!parseInt($scope.column1, 10)) ||
         (!parseFloat($scope.column2)) ||
         (!booleans.includes($scope.column3))) {
         $scope.valid = false;
      }
      else{
         $scope.valid = true;
      }
   };

   $scope.save = function() {

      $scope.column5Date.setHours(parseInt($scope.column5Time.split(":")[0]), 10);
      $scope.column5Date.setMinutes(parseInt($scope.column5Time.split(":")[1]), 10);

      var sendData = {
         column1: parseInt($scope.column1, 10),
         column2: parseFloat($scope.column2),
         column3: $scope.column3,
         column4: $scope.column4,
         column5: $scope.column5Date,
         column6: $scope.column6
      };
      return $http.post('/Tables/Table' + $rootScope.tableNum, sendData)
      .then(function() {
         $state.go('tableOverview', {tableNum: $rootScope.tableNum});
      });
   };
}]);
