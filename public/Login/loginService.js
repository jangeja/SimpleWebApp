app.factory("login", ["$http",
function($http) {
   var cookie;
   var user;

   return {
      login: function(loginData) {
         return $http.post("Sessions", loginData)

         .then(function(response) {
            var location = response.headers().location.split('/');

            cookie = location[location.length - 1];
            return $http.get("Sessions/" + cookie);
         })

         .then(function(response) {
            return $http.get('/Persons/' + response.data.prsId);
         })

         .then(function(response) {
            return response.data[0];
         });
      },

      logout: function() {
         return $http.delete("Sessions/" + cookie)
         .then(function() {
            user = null;
            cookie = null;
         });
      },

      getUser: function() {
         return user;
      }
   };
}]);
