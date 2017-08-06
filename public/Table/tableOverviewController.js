app.controller('tableOverviewController',
 ['$scope', '$state', '$http', '$uibModal', 'language', 'errMap',
  '$location', 'notifyDlg', 'rows', '$rootScope',
function ($scope, $state, $http, $uibM, language, errMap, $location, nDlg, rows, $rootScope) {

   rows.forEach(function(row){
      row.column5 = new Date(row.column5);
      row.column5.setMinutes(row.column5.getMinutes() - row.column5.getTimezoneOffset());
   });

   $scope.rows = rows;
   $rootScope.location = 'Table ' + $rootScope.tableNum;
}]);
