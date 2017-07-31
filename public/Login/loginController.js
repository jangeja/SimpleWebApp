app.controller('loginController',
 ['$scope', '$state', 'login', 'notifyDlg', 'language', 'errMap',
function($scope, $state, login, nDlg, language, errMap) {
   $scope.user = {email: "adm@11.com", password: "password"};
   $scope.location = "Login";
   $scope.login = function() {
      login.login($scope.user)

      .then(function(user) {
         $scope.$parent.user = user;
         $state.go('dashboard');
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

   $scope.logout = function() {
      login.logout($scope.user)

      .then(function(user) {
         $scope.$parent.user = null;
         $state.go('dashboard', {}, {reload: true});
         window.location.reload();
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
