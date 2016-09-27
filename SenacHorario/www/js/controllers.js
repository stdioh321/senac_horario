
angular.module('starter.controllers', [])

  .controller('CursosCtrl', function ($scope, $http, $ionicLoading, CursosServ) {
    $scope.cursos;
    $scope.horarios;
    $scope.semestres = [];
    $scope.diasSemana = [
      { name: "Segunda", id: 1, horarios: [] },
      { name: "Terça", id: 2, horarios: [] },
      { name: "Quarta", id: 3, horarios: [] },
      { name: "Quinta", id: 4, horarios: [] },
      { name: "Sexta", id: 5, horarios: [] },
      { name: "Sábado", id: 6, horarios: [] },
      { name: "Domingo", id: 7, horarios: [] }
    ];



    $ionicLoading.show({
      template: 'Carregando Cursos...'
    });
    CursosServ.getCursos().then(function (data) {
      $scope.cursos = data.data;
      $ionicLoading.hide();
    }, function (data) {
      $ionicLoading.hide();
      console.log("ERROR: ", data);
    });
    
    
    $scope.mudaDia = function (item) {
      $scope.diasSemana.forEach(function (el2) {
        el2.horarios = [];
      });
      if (!item) return;


      $scope.horarios.forEach(function (el1) {

        $scope.diasSemana.forEach(function (el2) {
          if (item.Semestre == el1.Semestre && el1.DiaSemana == el2.id) {
            el2.horarios.push(el1);
          }
        });


      });
      console.log($scope.diasSemana);

    };
    $scope.filterSemestre = function (item) {
      $scope.filterSemestre = item;
    }
    $scope.carregaHorarios = function (curso) {
      $scope.horarios = [];
      $ionicLoading.show({
      template: 'Carregando Horarios...'
    });
      CursosServ.getHorarios(curso.id).then(function (data) {

        $scope.horarios = data.data.horarios;
        console.log(data);
        var tmpIndexSem = 0;
        $scope.semestres = [];
        data.data.horarios.forEach(function (el) {

          var hasIn = $scope.semestres.some(function (el2) {
            if (el.Semestre == el2.Semestre) return true;
          });

          if (!hasIn) {
            $scope.semestres.push(el);
            // console.log("OK");
          }

        });
        $ionicLoading.hide();
        
        // console.log($scope.semestres);
      }, function (data) {
        $ionicLoading.hide();
        // console.log(data);
      })
    }
  });
