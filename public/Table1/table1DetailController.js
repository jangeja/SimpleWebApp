app.controller('table1DetailController',
 ['$scope', '$state', '$http', '$uibModal', 'notifyDlg', '$stateParams', 'msgs',
 'language', 'errMap',
function($scope, $state, $http, $uibM, nDlg, $stateParams, msgs,
 language, errMap) {

   $scope.msgs = msgs;

   $scope.newMsg = function() {
      $scope.dlgTitle = "New Message";
      $scope.cnvId = $stateParams.cnvId;

      $uibM.open({
         templateUrl: 'Conversation/newMsgDlg.template.html',
         scope: $scope
      }).result

      .then(function(newContent) {
         return $http.post("/Cnvs/" + $scope.cnvId + '/Msgs',
          {content: newContent});
      })

      .then(function() {
         return $http.get('/Cnvs/' + $scope.cnvId + '/Msgs');
      })

      .then(function(rsp) {
         msgs = rsp.data;
         msgs.forEach(function (element) {
            element.whenMade = (new Date(element.whenMade)).toString();
         });
         $scope.msgs = msgs;
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
