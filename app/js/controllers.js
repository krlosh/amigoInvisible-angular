'use strict';

/* Controllers */
var myAppControllers=angular.module('myApp.controllers', []);

myAppControllers.controller('ListaGruposController', ['$scope','GruposService','PerfilesService',function($scope,GruposService,PerfilesService) {
	$scope.listaGrupos=jQuery.grep(GruposService.getGrupos(),function (elemento,idx){
		var gruposUsuario = PerfilesService.cargaPerfil($scope.getLoggedUser.userName).grupos;
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

	$scope.nuevo={};
	$scope.grupoSeleccionado=$scope.listaGrupos[0].id;
	$scope.guardar=function(){		
		//si nuevo no vacio, crear y asignar a usuario logado
		if($scope.nuevo.nombre&&$scope.nuevo.nombre!=''){
			var g = {id:-1,nombre:$scope.nuevo.nombre};
			GruposService.crearGrupo(g);			
			GruposService.enlazarPerfil(g.id,$scope.getLoggedUser().userName);
		}
		else{
			//Asociar el grupo seleccionado al usuario logado			
			GruposService.enlazarPerfil($scope.grupoSeleccionado,$scope.getLoggedUser().userName);
		}
		$scope.go('/perfil');//???
	};
  }]);

 myAppControllers.controller('PerfilController', ['$scope','PerfilesService',function($scope,PerfilesService) {
 	$scope.perfil=PerfilesService.cargaPerfil($scope.getLoggedUser().userName);
 	//TODO:Guardar
 	$scope.quitarGrupo = function(grupoid){
 		PerfilesService.desenlazarPerfil($scope.perfil,grupoid); 		
 	};

 	$scope.guardar = function(){
 		if( $scope.passwd){
	 		if($scope.passwdRepetida == $scope.passwd ){
	 			PerfilesService.guardar($scope.perfil);
	 		}
	 		else{
	 			alert("Contraseña incorrecta ") ;
	 		}
 		}
 	};
  }]);


 myAppControllers.controller('GrupoController', ['$scope','$routeParams','GruposService',function($scope,$routeParams,GruposService) {
 	$scope.grupo=GruposService.buscarGrupo($routeParams.grupoId); //TODO:quitar los grupos a los que pertenece el logged user
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
 		GruposService.borrar($scope.grupo);
 		$scope.go('/perfil');
 	}
  }]);

 myAppControllers.controller('LoginCtrl',['$scope','UserService',function($scope,UserService){ 
 	$scope.loginData={
 		name:'',
 		passwd:''
 	};
 	$scope.login = function(){
 		//TODO verificar en backend
 		if($scope.loginData.name==$scope.loginData.passwd){
 			UserService.isLogged=true;
 			UserService.userName=$scope.loginData.name;
 			$scope.go('/perfil');
 		}
 		else{
			UserService.isLogged=false;
 			UserService.userName='';
 		}

 		console.log('user:'+UserService.userName); 		
 	}; 	
 }]);


myAppControllers.controller('RegistroController',['$scope',function($scope){
	$scope.nuevo={};
	$scope.guardar = function(){
		//TODO:Guardar nuevo usuario.
		var validacionOK = true;
		if($scope.nuevo.password!=$scope.nuevo.repitePassword){
			//TODO: Mostrar msg de error
			validacionOK=false;
		}
		//TODO:Resto de validaciones
		if(validacionOK){
			$scope.go('/');
		}
	}
}]);

myAppControllers.controller('SorteoDirectoController','SorteosService',['$scope',function($scope,SorteosService){
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