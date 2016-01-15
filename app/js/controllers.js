'use strict';

/* Controllers */
var myAppControllers=angular.module('myApp.controllers', []);

myAppControllers.controller('ListaGruposController', ['$scope','GruposService','PerfilesService',function($scope,GruposService,PerfilesService) {

	GruposService.getGrupos().then(function(todosGrupos){
		PerfilesService.cargaPerfil($scope.getLoggedUser().userName).then(function (perfilUsuario) {
			var gruposUsuario=perfilUsuario.grupos;
			$scope.listaGrupos=jQuery.grep(todosGrupos,function(elemento,idx){
				var encontrado=false;
				for(var i=0;i<gruposUsuario.length;i++){
					if(gruposUsuario[i].id==elemento.id){
						encontrado = true;
					}
				}
				if(!encontrado){
					return elemento;
				}
			});
			if($scope.listaGrupos.length>0){
				$scope.grupoSeleccionado=$scope.listaGrupos[0].id;
			}
		});
	});

	$scope.nuevo={};
	
	$scope.guardar=function(){		
		//si nuevo no vacio, crear y asignar a usuario logado
		if($scope.nuevo.nombre&&$scope.nuevo.nombre!=''){
			var g = {id:-1,nombre:$scope.nuevo.nombre};
			GruposService.crearGrupo(g).then(function(grupoCreado){
				GruposService.enlazarPerfil(grupoCreado.id,$scope.getLoggedUser().userName).then(function (grupoCreado) {
					$scope.go('/perfil');
				});
			});						
		}
		else{
			//Asociar el grupo seleccionado al usuario logado			
			GruposService.enlazarPerfil($scope.grupoSeleccionado,$scope.getLoggedUser().userName).then(function (grupoCreado) {
				$scope.go('/perfil');
			});
		}
	};
  }]);

 myAppControllers.controller('PerfilController', ['$scope','PerfilesService',function($scope,PerfilesService) {
 	PerfilesService.cargaPerfil($scope.getLoggedUser().userName).then(function(perfil){
 		$scope.perfil=perfil;	
 	}); 	
 	$scope.quitarGrupo = function(grupoid){
 		PerfilesService.desenlazarPerfil($scope.perfil,grupoid); 		
 	};

 	$scope.guardar = function(){
 		if( $scope.passwd){//Si no se cambia la password no se cambia nada en el perfil
	 		if($scope.passwdRepetida == $scope.passwd ){
	 			PerfilesService.guardar($scope.perfil,$scope.passwd).then(function(amigo){
					$scope.passwdRepetida='';
	 				$scope.passwd='';
	 			},function(error){
	 				console.log('ERROR:'+error);
	 			});
	 		}
	 		else{
	 			alert("Contraseña incorrecta ") ;
	 		}
 		}
 	};
  }]);


 myAppControllers.controller('GrupoController', ['$scope','$routeParams','GruposService',function($scope,$routeParams,GruposService) { 	
 	GruposService.buscarGrupo($routeParams.grupoId).then(function(grupo){
 		$scope.grupo=grupo;
 	});

 	$scope.modoNuevo=false;

 	$scope.verNuevo = function(){
 		$scope.modoNuevo=true;
 	};

 	$scope.eliminarEvento=function(evento){ 		
 		GruposService.eliminarEvento($scope.grupo,evento);
 		
 	}; 	
 	$scope.guardar=function(){
 		if($scope.modoNuevo&&$scope.nuevoEvento){
	 		var evento={
	 			nombre:$scope.nuevoEvento.nombre,
	 			fecha:$scope.nuevoEvento.fecha,
	 			id:-1
	 		}
	 		GruposService.anadirEvento($scope.grupo,evento);
	 		$scope.nuevoEvento={}; 		
	 		$scope.modoNuevo=false;
 		}
 	};
 	$scope.borrar=function(){
 		GruposService.borrar($scope.grupo).then(function(){
 			$scope.go('/perfil');
 		}); 		
 	}
  }]);

 myAppControllers.controller('LoginCtrl',['$scope','UserService','AutenticacionService',function($scope,UserService,AutenticacionService){ 
 	$scope.loginData={
 		name:'',
 		passwd:'' 		
 	};
 	$scope.messages=[];
 	$scope.login = function(){ 		
 		//El login deberia generar un token que se inlcuiría en todas las peticiones hacia el servidor ¿inyectando userService?
 		//http://blog.brunoscopelliti.com/authentication-to-a-restful-web-service-in-an-angularjs-web-app/ 		
	 	if($scope.loginData.name!='' && $scope.loginData.passwd!=''){
	 		AutenticacionService.validate($scope.loginData.name,$scope.loginData.passwd).then(function(response){
	 			//como ver si hay error de autenticacion????
				UserService.isLogged=true;
	 			UserService.userName=$scope.loginData.name;
	 			UserService.token=response;
	 			$scope.go('/perfil'); 		
	 		},
	            function (error) {
	                // handle errors here	                
	                $scope.messages=[];                
	                $scope.messages.push(error);
		 			UserService.isLogged=false;
		 			UserService.userName=''; 
		 			$scope.loginData.passwd='';			
	            });
	 		console.log('user:'+UserService.userName); 		
 		}
 	}; 	
 }]);


myAppControllers.controller('RegistroController',['$scope','PerfilesService',function($scope,PerfilesService){
	$scope.nuevo={};
	$scope.guardar = function(){		
		var validacionOK = true;
		if($scope.nuevo.login && $scope.nuevo.apodo && $scope.nuevo.email && $scope.nuevo.password && $scope.nuevo.repitePassword){
			if($scope.nuevo.password!=$scope.nuevo.repitePassword){				
				validacionOK=false;
			}
			//TODO:Resto de validaciones
			if(validacionOK){
				PerfilesService.crear($scope.nuevo).then(function(response){
					$scope.go('/');	
				},function (error) {
					console.log(error);
				});
				
			}
		}
	}
}]);

myAppControllers.controller('SorteoDirectoController',['$scope','SorteosService',function($scope,SorteosService){
	$scope.sorteo={
		nombre:'',
		introduccion:'',
		participantes:[]
	}
	$scope.nuevoParticipante={}
	//Le ponemos otro ng-model para que no se limpie al cambiar la selección del comobo multiple.
	$scope.addParticipante = function(){
		var participante={
			nombre:$scope.nuevoParticipante.nombre,
			email:$scope.nuevoParticipante.email
		};
		$scope.sorteo.participantes.push(participante);
		$scope.nuevoParticipante={};				
	};
	$scope.delParticipante = function(){
		//Eliminar los elementos de selectedValues
		for(var i=0;i<$scope.participantesSeleccionados.length;i++){
			var idx = $scope.sorteo.participantes.indexOf($scope.participantesSeleccionados[i]);
			if(idx>=0){
				$scope.sorteo.participantes.splice(idx,1);
			}
		}
	};
	$scope.sortear=function(){
		SorteosService.sortear($scope.sorteo);
		$scope.go('/perfil');
	};	
}]);

myAppControllers.controller('SorteoGrupoController', ['$scope','$routeParams','GruposService','SorteosService',function($scope,$routeParams,GruposService,SorteosService) {
	$scope.grupo=GruposService.buscarGrupo($routeParams.grupoId);
	$scope.sorteo={
		nombre:'Sorteo del grupo ' +$scope.grupo.nombre,
		introduccion:'',
		participantes:[]
	};
	$scope.sortear=function(){
		//Cuidado con email de integrantes del grupo
		$scope.sorteo.participantes = $scope.grupo.integrantes;
		SorteosService.sortear($scope.sorteo);
		$scope.go('/grupos/'+$routeParams.grupoId);
	};	
}]);

//Controlar que los servicios que van al servidor devuelven promises.