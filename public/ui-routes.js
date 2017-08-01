
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
      .state('table1RowDetail', {
         url: '/rows/:rowId',
         templateUrl: 'Table1/table1RowDetail.template.html',
         controller: 'table1RowDetailController',
         resolve: {
            msgs: ['$q', '$http', '$stateParams',function($q, $http, $stateParams) {
               console.log($stateParams.rowId);
               return $http.get('Tables/Table1/Rows/' + $stateParams.rowId)
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      });
   }]);
