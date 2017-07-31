app.controller('table1OverviewController',
 ['$scope', '$state', '$http', '$uibModal', 'language', 'errMap',
  '$location', 'notifyDlg', 'rows', '$rootScope',
function ($scope, $state, $http, $uibM, language, errMap, $location,
 nDlg, rows, $rootScope) {

   $scope.rows = rows;
   $rootScope.location = 'Table 1';
   $scope.newRow = function() {

      $scope.title = null;
      $scope.placeholderTitle = "Title";
      $scope.dlgTitle = "New Conversation";

      $uibM.open({
         templateUrl: 'Conversation/editCnvDlg.template.html',
         scope: $scope
      }).result

      .then(function(newTitle) {

         return $http.post("Cnvs", {title: newTitle});
      })

      .then(function() {
         return $http.get($location.url());
      })

      .then(function(rsp) {
         $scope.cnvs = rsp.data;
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

   $scope.editCnv = function (cnv) {
      $scope.placeholderTitle = cnv.title;

      $uibM.open({
         templateUrl: 'Conversation/editCnvDlg.template.html',
         scope: $scope
      }).result

      .then(function (title) {
         if (title)
            return $http.put('/Cnvs/' + cnv.id, {'title': title});
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

   $scope.delCnv = function(cnv) {
      nDlg.show($scope, "Delete conversation " + cnv.title,
       "Delete", ["Yes", "No"])

      .then(function (btn) {
         if (btn === 'Yes') {
            return $http.delete('/Cnvs/' + cnv.id);
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
