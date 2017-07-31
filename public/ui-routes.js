
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to dashboard if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('dashboard',  {
         url: '/dashboard',
         templateUrl: 'Dashboard/dashboard.template.html',
         controller: 'dashboardController',
      })
      .state('login', {
         url: '/login',
         templateUrl: 'Login/login.template.html',
         controller: 'loginController',
      })
      .state('register', {
         url: '/register',
         templateUrl: 'Register/register.template.html',
         controller: 'registerController',
      })
      .state('table1Overview', {
         url: '/table1Overview',
         templateUrl: 'Table1/table1Overview.template.html',
         controller: 'table1OverviewController',
         resolve: {
            rows: ['$q', '$http', '$stateParams', function($q, $http, $stateParams) {
               return $http.get('/Tables/Table1')
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      })
      .state('cnvDetail', {
         url: '/cnvs/:cnvId/Msgs',
         templateUrl: 'Conversation/cnvDetail.template.html',
         controller: 'cnvDetailController',
         resolve: {
            msgs: ['$q', '$http', '$stateParams',function($q, $http, $stateParams) {
               return $http.get('/Cnvs/' + $stateParams.cnvId + '/Msgs')
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      });
   }]);
