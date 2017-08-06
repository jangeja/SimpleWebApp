
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to dashboard if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home', {
         url: '/',
         templateUrl: 'Login/login.template.html',
         controller: 'loginController',
      })
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
      .state('tableOverview', {
         url: '/tableOverview/:tableNum',
         templateUrl: 'Table/tableOverview.template.html',
         controller: 'tableOverviewController',
         resolve: {
            rows: ['$q', '$http', '$stateParams', '$rootScope', function($q, $http, $stateParams, $rootScope) {

               $rootScope.tableNum = $stateParams.tableNum;
               return $http.get('/Tables/Table' + $stateParams.tableNum)
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      })
      .state('tableRowDetail', {
         url: '/rows/:rowId?index',
         templateUrl: 'Table/tableRowDetail.template.html',
         controller: 'tableRowDetailController',
         resolve: {
            rowData: ['$q', '$http', '$stateParams', '$rootScope', function($q, $http, $stateParams, $rootScope) {
               return $http.get('Tables/Table' + $rootScope.tableNum + '/Rows/' + $stateParams.rowId)
               .then(function(response) {
                  return {data: response.data, rowId: $stateParams.rowId, index: $stateParams.index};
               });
            }]
         }
      })
      .state('tableNewRow', {
         url: '/newRow',
         templateUrl: 'Table/tableNewRow.template.html',
         controller: 'tableNewRowController'
      })
      .state('rest', {
         url: '/rest',
         templateUrl: 'Rest/rest.template.html',
         controller: 'restController'
      });
   }]);
