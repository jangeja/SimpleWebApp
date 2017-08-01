app.controller('table1OverviewController',
 ['$scope', '$state', '$http', '$uibModal', 'language', 'errMap',
  '$location', 'notifyDlg', 'rows', '$rootScope',
function ($scope, $state, $http, $uibM, language, errMap, $location,
 nDlg, rows, $rootScope) {

   $scope.rows = rows;
   console.log(rows);
   $rootScope.location = 'Table 1';
   console.log(rows.length);
   $scope.newRow = function() {

      $scope.title = null;
      $scope.placeholderTitle = "Title";
      $scope.dlgTitle = "New Conversation";

      $uibM.open({
         templateUrl: 'Conversation/editRowDlg.template.html',
         scope: $scope
      }).result

      .then(function(newTitle) {

         return $http.post("Rows", {title: newTitle});
      })

      .then(function() {
         return $http.get($location.url());
      })

      .then(function(rsp) {
         $scope.rows = rsp.data;
      })

      .catch(function(err) {
         if (err && err.data) {
            err.data.forEach( function(error) {
               nDlg.show($scope, errMap[language.getLang()][error.tag],
                 "Error");
            });
         }
      });
   };

   $scope.editRow = function (row) {
      $scope.placeholderTitle = row.title;

      $uibM.open({
         templateUrl: 'Conversation/editRowDlg.template.html',
         scope: $scope
      }).result

      .then(function (title) {
         if (title)
            return $http.put('/Rows/' + row.id, {'title': title});
      })

      .then(function(rsp) {
         $state.reload();
      })

      .catch(function(err) {
         if (err && err.data) {
            err.data.forEach( function(error) {
               nDlg.show($scope, errMap[language.getLang()][error.tag],
                 "Error");
            });
         }
      });
   };

   $scope.delRow = function(row) {
      nDlg.show($scope, "Delete conversation " + row.title,
       "Delete", ["Yes", "No"])

      .then(function (btn) {
         if (btn === 'Yes') {
            return $http.delete('/Rows/' + row.id);
         }
      })

      .then(function(rsp) {
         $state.reload();
      })

      .catch(function(err) {
         if (err && err.data) {
            err.data.forEach( function(error) {
               nDlg.show($scope, errMap[language.getLang()][error.tag],
                 "Error");
            });
         }
      });
   };

}]);
