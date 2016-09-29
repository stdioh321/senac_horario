angular.module('starter.services', [])
  .factory('CursosServ', function ($http) {
    var _getCursos = function () {
      return $http({
        url: config.urlCors + config.urlCursos,
        method: "GET"
      });
    }
    var _getHorarios = function (cursoId) {
      return $http({
        url: config.urlCors + config.urlHorarios + config.paramsConsulta + cursoId,
        method: "GET"
      });
    }
    var _criaJsonHorarios = function( ){

    };
    return {
      getCursos: _getCursos,
      getHorarios: _getHorarios
    };
  });