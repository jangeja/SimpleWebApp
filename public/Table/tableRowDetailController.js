app.controller('tableRowDetailController',
   ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', '$stateParams', 'rowData',
   'language', 'errMap', '$rootScope',
function($scope, $state, $http, $uibM, nDlg, $stateParams, rowData,
   language, errMap, $rootScope) {
   $rootScope.location = "Table " + $rootScope.tableNum + ' Row ' + rowData.index;
   
   rowData.data.column4 = new Date(rowData.data.column4);
   rowData.data.column4.setMinutes(rowData.data.column4.getMinutes() - rowData.data.column4.getTimezoneOffset());
   console.log(rowData);
   rowData.data.column5Date = new Date(rowData.data.column5);
   rowData.data.column5Date.setMinutes(rowData.data.column5Date.getMinutes() - rowData.data.column5Date.getTimezoneOffset());

   var min = rowData.data.column5Date.getMinutes();
   if (min < 10) {
      min = "0" + min;
   }

   rowData.data.column5Time = rowData.data.column5Date.getHours() + ":" + min;
   $scope.rowData = rowData.data;
   $scope.index = rowData.index;
   $scope.valid = true;
   var booleans = ['true', 'false', false, true];

   $scope.validate = function() {
      if (($scope.rowData.column5Time && !$scope.rowData.column5Time.match("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")) ||
         (!parseInt($scope.rowData.column1, 10)) ||
         (!parseFloat($scope.rowData.column2)) ||
         (!booleans.includes($scope.rowData.column3))) {
         $scope.valid = false;
      }
      else{
         $scope.valid = true;
      }
   };

   $scope.save = function() {
      $scope.rowData.column5Date.setHours(parseInt($scope.rowData.column5Time.split(":")[0]), 10);
      $scope.rowData.column5Date.setMinutes(parseInt($scope.rowData.column5Time.split(":")[1]), 10);

      var sendData = {
         column1: parseInt($scope.rowData.column1, 10),
         column2: parseFloat($scope.rowData.column2),
         column3: $scope.rowData.column3,
         column4: $scope.rowData.column4,
         column5: $scope.rowData.column5Date,
         column6: $scope.rowData.column6
      };
      return $http.put('/Tables/Table' + $rootScope.tableNum + '/Rows/' + rowData.rowId, sendData)
      .then(function() {
         console.log("success");
      });
   };
   $scope.delete = function() {
      return $http.delete('/Tables/Table' + $rootScope.tableNum + '/Rows/' + rowData.rowId)
      .then(function() {
         console.log('deleted');
         $state.go('tableOverview', {tableNum: $rootScope.tableNum});
      })
   }

}]);
