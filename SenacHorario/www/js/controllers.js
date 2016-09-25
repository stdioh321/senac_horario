urlCors = "https://crossorigin.me/";

angular.module('starter.controllers', [])

  .controller('CursosCtrl', function ($scope, $http) {
    $scope.test = [];
    
    
    $scope.getCursos = function () {
      $http({
        method: "GET",
        url: urlCors + "http://sistemasparainternet.azurewebsites.net/horarios/2.0/getCursos.php",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function (data, status) {
        $scope.cursos = data.data.cursos;
        // console.log($scope.cursos);
      }, function (data, status) {

      });
    };

    $scope.getHorarios = function (curso) {
      // console.log(curso.id);
      var tmpUrl = urlCors+"http://sistemasparainternet.azurewebsites.net/horarios/2.0/getHorarios.php?id="+curso.id;
      // console.log(tmpUrl);
      $http({
        method: "GET",
        url:tmpUrl,
        headers:{
          "Content-Type":"application/json"
        }
      }).then(function(data, status){
        console.log(data.data);
        $scope.test = [];
        $scope.test2 = [];
        var tmpSem = "";
        
        data.data.horarios.forEach(function(el){
          if(tmpSem == "" || tmpSem != el.Semestre){
            tmpSem = el.Semestre;
            $scope.test.push(tmpSem);
          }
        
        });
        console.log($scope.test);
        $scope.horarios = data.data.horarios;
        
      }, function(data, status){

      });
    };
    $scope.getCursos();


  })

  .controller('DashCtrl', function ($scope) { })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
