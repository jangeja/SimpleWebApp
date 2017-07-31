
var app = angular.module('mainApp', [
   'ui.router',
   'ui.bootstrap'
]);

app.constant('languages', {
   languages: {
      en : [
         {code: 'en', label: 'English'},
         {code: 'es', label: 'Spanish'}
      ],
      es : [
         {code: 'en', label: 'Ingles'},
         {code: 'es', label: 'Espanol'}
      ]
   }
});

app.constant("errMap", {
   es : {
      missingField: '[ES] Field missing from request: ',
      badValue: '[ES] Field has bad value: ',
      notFound: '[ES] Entity not present in DB',
      badLogin: '[ES] Email/password combination invalid',
      dupEmail: '[ES] Email duplicates an existing email',
      noTerms: '[ES] Acceptance of terms is required',
      forbiddenRole: '[ES] Role specified is not permitted.',
      noOldPwd: '[ES] Change of password requires an old password',
      oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
      dupTitle: '[ES] Conversation title duplicates an existing one',
      dupEnrollment: '[ES] Duplicate enrollment',
      forbiddenField: '[ES] Field in body not allowed.',
      queryFailed: '[ES] Query failed (server problem).'
   },
   en : {
      missingField: 'Field missing from request: ',
      badValue: 'Field has bad value: ',
      notFound: 'Entity not present in DB',
      badLogin: 'Email/password combination invalid',
      dupEmail: 'Email duplicates an existing email',
      noTerms: 'Acceptance of terms is required',
      forbiddenRole: 'Role specified is not permitted.',
      noOldPwd: 'Change of password requires an old password',
      oldPwdMismatch: 'Old password that was provided is incorrect.',
      dupTitle: 'Conversation title duplicates an existing one',
      dupEnrollment: 'Duplicate enrollment',
      forbiddenField: 'Field in body not allowed.',
      queryFailed: 'Query failed (server problem).'
   }
});

app.filter('tagError', ['errMap', 'language', function(errMap, language) {

   return function(err, title) {
      return errMap[language.getLang()][err.tag] +
       (err.params && err.params.length ? err.params[0] : "");
   };
}]);

app.directive('cnvSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         cnv: "=toSummarize",
         user: "=",
         delCnv: '&',
         editCnv: '&'
      },
      template: '<a  href="#" ui-sref="cnvDetail({cnvId:{{cnv.id}}})">' +
       '{{cnv.title}} {{cnv.lastMessage | date : "medium"}}</a>' +
       '<button type="button" class="btn btn-default btn-sm pull-right"' +
       'ng-show="user && user.id == cnv.ownerId" ng-click="delCnv({cnv: cnv})">' +
       '<span class="glyphicon glyphicon-trash"></span>' +
       '</button>' +
       '<button type="button" class="btn btn-default btn-sm pull-right"' +
       'ng-show="user && user.id == cnv.ownerId" ng-click="editCnv({cnv: cnv})">' +
       '<span class="glyphicon glyphicon-edit"></span>' +
       '</button>'
   };
}]);

app.directive('msgSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         msg: "=toSummarize"
      },
      template: '<p>Message Made: {{msg.whenMade}}</p>' +
       '<p>Author: {{msg.email}}</p>' +
       '<p>Content: {{msg.content}}</p>'
   };
}]);


app.service('language', function() {
   var lang =  navigator.languages ? navigator.languages[1]
    : (navigator.language || navigator.userLanguage);

   return {
      getLang: function() {
         return lang;
      },
      setLang: function(newLang) {
         lang = newLang;
      }
   };
});
