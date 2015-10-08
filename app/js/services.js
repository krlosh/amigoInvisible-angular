'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myAppServices = angular.module('myApp.services', []);

myAppServices.value('version', '0.1');

myAppServices.factory('UserService',[function(){
	var sdo={
		isLogged:false,
		username:''
	};

	return sdo;
}]);


myAppServices.factory('GruposService',[function(){
	return {
		grupos:[{
				id:0,
				nombre:'G1',
				proximoEvento:{
					nombre:'ev1',
					fecha:'01/01/2014'
					},
				integrantes:[{
		 				nombre:'yo',
		 				email:'yo@yo.es'
		 			},
		 			{
		 				nombre:'tu',
		 				email:'tu@tu.es'
		 			}
		 		],
		 		eventos:[{
		 				idEvento:0,
						nombre:'b',
						fecha:'01/01/2014'
					},
					{
		 				idEvento:1,
						nombre:'a',
						fecha:'01/01/2013'
					}
		 		]
				},
				{
				id:10,
				nombre:'G2'
				},
				{
				id:1,
				nombre:'G3'
				}],
		getGrupos: function(){
			return this.grupos;
		},		
		crearGrupo:function(grupo){
			grupo.id=this.grupos.length;
			this.grupos.push({id:grupo.id,nombre:grupo.nombre,proximoEvento:{},integrantes:[],eventos:[]});
		},
		buscarGrupo:function(idGrupo){
			//optimizar esta busqueda:
			for(var i=0;i<this.grupos.length;i++){
				if(this.grupos[i].id==idGrupo){
					return this.grupos[i];
				}
			}
			return {};
		},
		enlazarPerfil:function(idgrupo,perfil){
			console.log(idgrupo);
			this.buscarGrupo(idgrupo).integrantes.push(perfil);			
		},
		eliminarEvento:function(grupo,evento){
			var idx = grupo.eventos.indexOf(evento);
 			grupo.eventos.splice(idx,1);//TODO:Invocar a un servicio para borrar en backend??
		},
		anadirEvento:function(grupo,evento){
			evento.id=grupo.eventos.length;
			grupo.eventos.push(evento);
		},
		borrar:function(grupo){
			console.log('Borrando ....');
			this.grupos.splice(grupo,1);
		}
	}
}]);

myAppServices.factory('PerfilesService',[function(){
	return {
		cargaPerfil:function(login){
			//TODO:Busar el perfil del login.
			return {login:login,
 					apodo:'mio',
 					email:'a@b.es'
 					,
 					grupos:[{
 						id:0,
 						nombre:'G1',
 						proximoEvento:{
 							nombre:'ev1',
 							fecha:'01/01/2014'
 							}
 						},
 						{
 						id:1,
 						nombre:'G3'
 						}
 					]
 				};
		},
		desenlazarPerfil:function(perfil,grupoId){
			var pos=-1;
			for(var i=0;i<perfil.grupos.length;i++){
				if(perfil.grupos[i].id==grupoId){
					pos=i;
				}
			}
			if(pos!=-1){
				perfil.grupos.splice(pos,1);
			}
		},
		guardar:function(perfil){
			//TODO: Implementar guardado
			console.log('Guardando.....');
		}
	}
}]);		

myAppServices.factory('SorteosService',[function(){
	return {
		sortear:function(sorteo){
			//nombre
			//introduccion
			//participantes.
			console.log('Sortear '+sorteo.nombre+' - ' + sorteo.introduccion+ ' - '+sorteo.participantes);
		}
	}
}]);