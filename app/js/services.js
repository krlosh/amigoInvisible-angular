'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myAppServices = angular.module('myApp.services', []);

myAppServices.value('version', '0.1');

myAppServices.factory('UserService',[function(){
	var sdo={
		isLogged:false,
		username:'',
		token:''
	};

	return sdo;
}]);

myAppServices.factory('remoteApiFacade',['$http','$q',function($http,$q){
	return {
			server:'http://localhost:9080',
	        handleError:function( response ) {
                // The API response from the server should be returned in a
                // nomralized format. However, if the request was not handled by the
                // server (or what not handles properly - ex. server error), then we
                // may have to normalize it on our end, as best we can.
                if (
                    ! angular.isObject( response.data ) ||
                    ! response.data.message
                    ) {
                    return( $q.reject( "An unknown error occurred." ) );
                }
                // Otherwise, use expected error message.
                return( $q.reject( response.data.message ) );
            },

            handleSuccess:function( response ) {
                return( response.data );
            },

            get:function(url,paramsToSend){
        	    var request = $http({
                    method: "get",
                    params: paramsToSend,
                    url: this.server+url                    
                });
                return( request.then(this.handleSuccess, this.handleError ) );
            }

	}
}]);

myAppServices.factory('GruposService',['remoteApiFacade',function(remoteApiFacade){
	return { //Importante. Los grupos deben tener integrantes y eventos aunque sean vacios
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
				nombre:'G2',
				integrantes:[],
				eventos:[]				
				},
				{
				id:1,
				nombre:'G3',
				integrantes:[],
				eventos:[]
				}],
		getGrupos: function(){
			//
			//return this.grupos;
			return remoteApiFacade.get('/amigoInvisible-rest/grupos');
		},		
		crearGrupo:function(grupo){
			grupo.id=this.grupos.length;
			this.grupos.push({id:grupo.id,nombre:grupo.nombre,proximoEvento:{},integrantes:[],eventos:[]});
		},
		buscarGrupo:function(idGrupo){
			//optimizar esta busqueda:
			/*for(var i=0;i<this.grupos.length;i++){
				if(this.grupos[i].id==idGrupo){
					return this.grupos[i];
				}
			}
			return {};*/
			return remoteApiFacade.get('/amigoInvisible-rest/grupos/'+idGrupo);
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

myAppServices.factory('PerfilesService',['remoteApiFacade',function(remoteApiFacade){
	return {
		cargaPerfil:function(login){

			return remoteApiFacade.get('/amigoInvisible-rest/usuario/'+login);

			//TODO:Busar el perfil del login.
			/*return {login:login,
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
 				};*/
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

/*URLs de backend a Crear ¿Como pasar el localhost para que sean direcciones relativas y no absolutas?
Ver uso de servicio angular $http
*/
/*
login			-> POST /sesion (SesionController)
logout 			-> DELETE /sesion (SesionController)
crearUser 		-> POST /usuario (UsuarioController)
cargarPerfil 	-> GET /usuario/{perfilId} (UsuarioController)
guardarPerfil	-> POST /usuario/{perfilId} (UsuarioController)
desenlazarPerfil-> DELETE /grupos/{grupoId}/usuario?{integrante} 
enlazarPerfil	-> POST /grupos/{grupoId}/usuario?{integrante} 
getGrupos		-> GET /grupos (GrupoController )
crearGrupo		-> POST /grupos (GrupoController )
buscarGrupo		-> GET /grupos/{grupoId} (GrupoController )
guardarGrupo	-> POST /grupos/{grupoId} (GrupoController )
eliminarEvento	-> DELETE /grupos/eventos/{eventoId} (EventoController)
añadirEvento	-> POST /grupos/eventos/{eventoId} (EventoController)
sortear 		-> POST /sorteo (SorteoController)
*/