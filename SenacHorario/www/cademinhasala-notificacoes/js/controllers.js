
app.controller("appCtrl", function($scope, $http, $timeout) {
    $scope.cursos;
    $scope.turmas;
    $scope.flags = {};
    var getCursos = function() {
        toastr.info("Carregando Lista de Cursos", "", { timeOut: 0, closeButton: true, progressBar: true });
        $http({
            url: config.urlCors + config.urlCursos,
            method: "GET",
            cache: true
        }).then(function(data) {
            // console.log(data);
            $scope.cursos = data.data.cursos;
            toastr.clear();
        }, function(data) {
            toastr.clear();
            toastr.error("Não foi possivel carregar a lista de Cursos, Recarregue a pagina e tente novamente", "Oops!!", { timeOut: 5000, closeButton: true, progressBar: true });
            console.log(data);
        });

    }
    $scope.sendNotification = function(send) {
        $scope.send = {};
        $scope.myForm.$setPristine();
        var data = {
            "app_id": config.appId,
            "included_segments": ["All"],
            "data": {
                "data": "data"
            },
            "contents": {
                "en": send.mensagem
            },
            "headings": {
                "en": send.titulo
            }
        }
        if (send.turmaId) {
            data.filters = [{
                "field": "tag",
                "key": "turmaId",
                "relation": "=",
                "value": send.turmaId
            }];
        } else if (send.cursoId) {
            data.filters = [{
                "field": "tag",
                "key": "cursoId",
                "relation": "=",
                "value": send.cursoId
            }];

        }

        $http({
            url: config.urlNotification,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": config.auth
            },
            data: data

        }).then(function(data) {
            console.log(data);
            $scope.flags.flagSuccesso = true;
            $timeout(function() {
                $scope.flags.flagSuccesso = false;
            }, 4000);


        }, function(data) {
            $scope.flags.flagFalha = true;
            $timeout(function() {
                $scope.flags.flagFalha = false;

            }, 4000);

            console.log("ERROR", data);
        });
    };

    $scope.trocaCurso = function() {
        console.log(this);
        $scope.turmas = [];
        toastr.info("Carregando Lista de Turmas", "", { timeOut: 0, closeButton: true, progressBar: true });
        $http({
            url: config.urlCors + config.urlHorarios + config.paramsConsulta + this.send.cursoId,
            method: "GET",
            cache: true
        }).then(function(data) {
            console.log(data);
            var tmpTurmas = [];
            $scope.turmas = data.data.horarios.filter(function(el1) {
                var flag = false;
                tmpTurmas.forEach(function(el2) {
                    if (el2.Turma == el1.Turma) flag = true;
                });

                if (!flag) {
                    tmpTurmas.push(el1);
                    return true;
                } else {
                    return false;
                }

            });
            toastr.clear();

        }, function(data) {
            console.log("Error", data);
            toastr.clear();
            toastr.error("Não foi possivel carregar a lista de turmas, tente novamente", "Oops!!", { timeOut: 5000, closeButton: true, progressBar: true });
        })
    }
    getCursos();

});
