
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
      window.open = cordova.InAppBrowser.open;
    }

    $scope.$on("$ionicView.afterEnter", function (event, data) {
      $scope.carregaCurso();
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
    $ionicModal.fromTemplateUrl('templates/modal-help.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal2 = modal;
    });

    $scope.openModal2 = function () {
      $scope.modal2.show();

    };
    $scope.closeModal2 = function () {
      $scope.modal2.hide();
    };

    // $scope.$on('$destroy', function () {
    //   $scope.modal2.remove();
    // });



    $ionicPopover.fromTemplateUrl('templates/popover-more.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };

    $scope.showAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Sobre',
        template: '<div class="list"> <div class="item"> <h3>Desenvolvedor</h3> <h2>Henrique Lino Dias</h5> <p>diaslino.h@gmail.com</p> <h4>Polygon-Games</h4> </div> </div>'
      });
    };
    $scope.showAlert2 = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Cursos',
        template: '<div class="list"> <div class="item item-text-wrap"> <h3> <i class="icon ion-heart-broken"></i> Ooppss!! Houve um problema ao carregar os cursos, verifique seu acesso a Internet e clique no botão de recarregar localizado na barra de titulo. </h3> </div> </div>'
      });
    };
    $scope.showAlert3 = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Horarios',
        template: '<div class="list"> <div class="item item-text-wrap"> <h3> <i class="icon ion-heart-broken"></i> Ooppss!! Houve um problema ao carregar os Horarios, verifique seu acesso a Internet e tente novamente. </h3> </div> </div>'
      });
    };
    $scope.showAlert4 = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Mensagens',
        template: '<div class="list"> <div class="item item-text-wrap"> <h3> <i class="icon ion-heart-broken"></i> Ooppss!! Houve um problema ao carregar as Mensagens, verifique seu acesso a Internet e tente novamente. </h3> </div> </div>'
      });
    };

    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Consume Ice Cream',
        template: 'Are you sure you want to eat this ice cream?'
      })
      return confirmPopup;
    }


    function carregaMensagens() {
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
        $scope.showAlert4();
      });
    }
    $scope.carregaCurso = function () {
      $ionicLoading.show({
        template: 'Carregando Cursos...'
      });
      CursosServ.getCursos().then(function (data) {
        $scope.cursos = data.data;
        $scope.userData.flagCursos = false;
        $ionicLoading.hide();


      }, function (data) {
        $ionicLoading.hide();
        $scope.showAlert2();
        $scope.userData.flagCursos = true;
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
        // console.log(data);
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
        $scope.showAlert3();
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



      $scope.diasSemana.forEach(function (el1, idx1, arr1) {
        var tmpDisciplina;
        var tmpIndex;

        tmpHorario = el1.horarios.filter(function (el2, idx2, arr2) {
          if (tmpDisciplina == el2.Disciplina) {
            tmpDisciplina = el2.Disciplina;
            arr2[tmpIndex].faixaHoraria += '/' + el2.faixaHoraria;
            return false;
          } else {
            tmpDisciplina = el2.Disciplina;
            tmpIndex = idx2;
            var tmpProfessor = professores.filter(function (el3) {
              if (el2.Professor == el3.name) return true;
            });
            if (tmpProfessor.length > 0) {
              // criaBlob(tmpProfessor[0].photo, tmpProfessor[0]);
              el2.infoProfessor = tmpProfessor[0];
            }
            else {
              el2.infoProfessor = {};
              el2.infoProfessor.photo = "img/user-default.png";
            }
            return true;
          }

        });
        // console.log(tmpHorario);
        el1.horarios = tmpHorario;
      });

      $scope.diasSemana.forEach(function (el1, idx1, arr1) {
        var totalHorarios = el1.horarios.length;
        var cont = 0;
        el1.horarios.forEach(function (el2, idx2, arr2) {
          criaBlob(el2.infoProfessor.photo, el2, cont, totalHorarios);

        });
      });
      $scope.userData.semestre = item;
      $scope.userData.flagMessage = true;
      $scope.userData.dias = $scope.diasSemana;
      // localStorage.userData = JSON.stringify($scope.userData);


    };

    $scope.openInBrowser = function (url) {
      window.open(encodeURI(url), '_system');
      return false;
    }

    function criaBlob(url, horario, cont, totalHorario) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', config.urlCors + url);
      xhr.responseType = 'blob';
      xhr.send();

      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var blob = URL.createObjectURL(this.response);
          var reader = new FileReader();

          reader.readAsDataURL(this.response);
          reader.onloadend = function () {
            horario.infoProfessor.photo = this.result;
            if (cont == totalHorario - 1)
              localStorage.userData = JSON.stringify($scope.userData);
          }


        }
      }
    }

  });
