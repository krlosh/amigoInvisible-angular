
// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngMessages',
/*  'myApp.filters',*/
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
      templateUrl: 'partials/login.html', 
      controller: 'LoginCtrl',
      isFree:true
    });
  $routeProvider.when('/registro', {
      templateUrl: 'partials/registro.html', 
      controller: 'RegistroController',
      isFree:true
    });
  $routeProvider.when('/perfil', {
      templateUrl: 'partials/perfil.html', 
      controller: 'PerfilController',
      isFree:false
    });
  $routeProvider.when('/grupos/nuevo', {
      templateUrl: 'partials/nuevoGrupo.html', 
      controller: 'ListaGruposController',
      isFree:false
    });
  $routeProvider.when('/grupos/:grupoId', {
      templateUrl: 'partials/grupo.html', 
      controller: 'GrupoController',
      isFree: false
    });
  $routeProvider.when('/sorteos/nuevo', {
      templateUrl: 'partials/sorteoDirecto.html', 
      controller: 'SorteoDirectoController',
      isFree: false
    });
   $routeProvider.when('/sorteos/:grupoId', {
      templateUrl: 'partials/sorteoGrupo.html', 
      controller: 'SorteoGrupoController',
      isFree: false
    });   
  $routeProvider.otherwise({redirectTo: '/login'});
}]);  


myApp.run(['$rootScope', '$location','$window','UserService',  function ($rootScope, $location, $window,UserService) {
	'use strict';
	$rootScope.go = function (path){
		 if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }
        
        else { // Go to the specified path
            $location.path(path);
        }
	};
  $rootScope.logout = function(){
    UserService.isLogged=false;
    UserService.userName='';
    console.log("logging out");
    $rootScope.go('/login');
  };
  $rootScope.getLoggedUser=function(){
    return UserService;
  }
  $rootScope.$on('$routeChangeStart',function(event,currRoute,prevRoute){     
      if(!currRoute.isFree ){
        if ( !UserService.isLogged){
          console.log('Acceso denegado');
          $rootScope.go('/login');          
        }
        else{
          console.log('Permitido ' +UserService.userName);
        }
      }
      else{
        console.log('Acceso libre');
      }
  });  
}]);


