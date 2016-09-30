
angular.module('starter.controllers', [])

  .controller('CursosCtrl', function ($scope, $http, $ionicLoading, CursosServ, $ionicPopup, $ionicPopover, $ionicModal) {
    $scope.userInfo = {};
    $scope.userData = {};
    $scope.cursos;
    $scope.horarios;
    $scope.semestres = [];
    $scope.flagDiasSemana = false;
    $scope.diasSemana = [
      { name: "Segunda", id: 1, horarios: [] },
      { name: "Terça", id: 2, horarios: [] },
      { name: "Quarta", id: 3, horarios: [] },
      { name: "Quinta", id: 4, horarios: [] },
      { name: "Sexta", id: 5, horarios: [] },
      { name: "Sábado", id: 6, horarios: [] },
      { name: "Domingo", id: 7, horarios: [] }
    ];

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {

    }
    $scope.$on("$ionicView.afterEnter", function (event, data) {
      carregaCurso();
    });

    $scope.$on("$ionicView.loaded", function (event, data) {
      if (localStorage.userData) {
        $scope.userData = JSON.parse(localStorage.userData);
      }
    });

    $ionicModal.fromTemplateUrl('templates/modal-messages.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    function carregaMensagens(){
      $ionicLoading.show({
        template: 'Carregando Mensagens...'
      });
      CursosServ.getMensagens($scope.userData.curso.id).then(function (data) {
        console.log(data.data.mensagens);
        $scope.userData.mensagens = data.data.mensagens;
        $ionicLoading.hide();
      }, function (data) {
        console.log("ERRO", data);
        $ionicLoading.hide();
      });
    }
    $scope.openModal = function () {
      $scope.modal.show();
      carregaMensagens();
      
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });


    $ionicPopover.fromTemplateUrl('templates/popover-more.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };

    function carregaCurso() {
      $ionicLoading.show({
        template: 'Carregando Cursos...'
      });
      CursosServ.getCursos().then(function (data) {
        $scope.cursos = data.data;
        $ionicLoading.hide();
      }, function (data) {
        $ionicLoading.hide();
        if(confirm("Ocorreram problemas para carregar os Cursos, verifique seu acesso a internet, tentar carregar novamente???"))
          carregaCurso();
        console.log("ERROR: ", data);
      });
    }

    $scope.filterSemestre = function (item) {
      $scope.filterSemestre = item;
    }
    $scope.carregaHorarios = function (curso) {
      $scope.horarios = [];
      $scope.semestres = [];
      $scope.userData = {};

      $scope.diasSemana.forEach(function (el2) {
        el2.horarios = [];
      });
      if (!curso) return;


      $scope.userData.curso = curso;

      $ionicLoading.show({
        template: 'Carregando Horarios...'
      });
      CursosServ.getHorarios(curso.id).then(function (data) {

        $scope.horarios = data.data.horarios;
        console.log(data);
        var tmpIndexSem = 0;

        data.data.horarios.forEach(function (el) {

          var hasIn = $scope.semestres.some(function (el2) {
            if (el.Semestre == el2.Semestre) return true;
          });

          if (!hasIn) {
            $scope.semestres.push(el);
          }
        });
        $ionicLoading.hide();

      }, function (data) {
        $ionicLoading.hide();
      });
    }

    $scope.mudaDia = function (item) {
      $scope.flagDiasSemana = false;

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
      $scope.userData.semestre = item;
      $scope.userData.flagMessage = true;
      $scope.userData.dias = $scope.diasSemana;
      localStorage.userData = JSON.stringify($scope.userData);


    };

  });
