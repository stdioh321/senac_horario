app.filter("dateToTime", function () {
        return function (input) {
            return new Date(input).getTime();
        }
    });