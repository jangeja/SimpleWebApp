app.controller('loginController',
 ['$scope', '$state', 'login', 'notifyDlg', '$rootScope',
function($scope, $state, login, nDlg, $rootScope) {
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
         $rootScope.user = null;
         $scope.user = null;
         $state.go('home');
         window.location.reload();
      })

      .catch(function(err) {
         console.log(err);
      });
   };
}]);
