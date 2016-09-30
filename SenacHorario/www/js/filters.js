app
    .filter("dateToTime", function () {
        return function (input) {
            return new Date(input).getTime();
        }
    })
    .filter("alterFaixaHoraria", function () {
        return function (input) {
            var tmp = input.split(" ");

            return tmp[0] + " - " + tmp[tmp.length - 1];
        }
    });