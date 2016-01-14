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
            },

            post:function(url,dataToSend){
            	 var request = $http({
                    method: "post",
                    data: dataToSend,
                    url: this.server+url, 
                    headers: {
            			'Content-Type': 'application/json'
   					} 
                });
            	return( request.then(this.handleSuccess, this.handleError ) );
            },
            delete:function(url,dataToSend){
            	var request = $http({
                    method: "delete",                    
                    data: dataToSend,
                    url: this.server+url , 
                    headers: {
            			'Content-Type': 'application/json'
   					}                  
                });
            	return( request.then(this.handleSuccess, this.handleError ) );
            }
	}
}]);

myAppServices.factory('GruposService',['remoteApiFacade',function(remoteApiFacade){
	return { //Importante. Los grupos deben tener integrantes y eventos aunque sean vacios
		getGrupos: function(){						
			return remoteApiFacade.get('/amigoInvisible-rest/grupos');
		},		
		crearGrupo:function(grupo){			
			return remoteApiFacade.post('/amigoInvisible-rest/grupos',grupo);
		},
		buscarGrupo:function(idGrupo){			
			return remoteApiFacade.get('/amigoInvisible-rest/grupos/'+idGrupo);
		},
		enlazarPerfil:function(idgrupo,perfil){
			console.log(idgrupo);
			return remoteApiFacade.post('/amigoInvisible-rest/grupos/'+idgrupo+'/usuario',perfil);			
		},
		eliminarEvento:function(grupo,evento){
			remoteApiFacade.delete('/amigoInvisible-rest/grupos/'+grupo.id+'/eventos/'+evento.id);
			var idx = grupo.eventos.indexOf(evento);
 			grupo.eventos.splice(idx,1);
		},
		anadirEvento:function(grupo,evento){
			remoteApiFacade.post('/amigoInvisible-rest/grupos/'+grupo.id+'/eventos',evento).then(function(evento){
				grupo.eventos.push(evento);
			});
			
		},
		borrar:function(grupo){
			console.log('Borrando ....');
			return remoteApiFacade.delete('/amigoInvisible-rest/grupos/'+grupo.id);
		}
	}
}]);

myAppServices.factory('PerfilesService',['remoteApiFacade',function(remoteApiFacade){
	return {
		cargaPerfil:function(login){

			return remoteApiFacade.get('/amigoInvisible-rest/usuario/'+login);

		},
		desenlazarPerfil:function(perfil,grupoId){
			var pos=-1;
			var integrante={}
			for(var i=0;i<perfil.grupos.length;i++){
				if(perfil.grupos[i].id==grupoId){
					pos=i;
					for(var j=0;j<perfil.grupos[i].integrantes.length;j++){
						if(perfil.grupos[i].integrantes[j].email==perfil.email){
							integrante = perfil.grupos[i].integrantes[j];
						}
					}
				}
			}
			if(pos!=-1){
				perfil.grupos.splice(pos,1);
				return remoteApiFacade.delete('/amigoInvisible-rest/grupos/'+grupoId+'/usuario',integrante);
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
			//TODO: implementar llamada a backend
			console.log('Sortear '+sorteo.nombre+' - ' + sorteo.introduccion+ ' - '+sorteo.participantes);
		}
	}
}]);

/*URLs de backend a Crear 
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
eliminarEvento	-> DELETE /grupos/{grupoId}/eventos/{eventoId} (EventoController)
añadirEvento	-> POST /grupos/{grupoId}/eventos/{eventoId} (EventoController)
sortear 		-> POST /sorteo (SorteoController)
*/