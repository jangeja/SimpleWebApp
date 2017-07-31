app.controller('dashboardController', ['$scope','$uibModal', 'language', 'languages', '$rootScope',

function($scope, $uibModal, language, languages, $rootScope) {
   $scope.languages = languages.languages[language.getLang()];
   $scope.location = "Dashboard";
   $rootScope.location = "Dashboard";
   $scope.user = $rootScope.user;
   console.log($rootScope.user);
   $scope.updateLang = function () {
      language.setLang($scope.language.code);
      $scope.languages = languages.languages[language.getLang()];
   };
}]);
