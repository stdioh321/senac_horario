// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // alert("Platform Ready");
        // var splash = document.getElementById("custom-overlay");
        // splash.className = "splash-in";
        // setTimeout(function() {
        //     splash.className = "splash-out";
        //     setTimeout(function() {
        //         // console.log("Removed");
        //         splash.parentNode.removeChild(splash);
        //     }, 3000);

        // }, 5000);

        window.plugins.OneSignal
            .startInit("b2d3d26e-3c1f-42ca-be45-fb2049c859a3", "298017792065")
            .endInit();

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        // if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //   cordova.plugins.Keyboard.disableScroll(true);

        // }
        // if (window.StatusBar) {
        //   // org.apache.cordova.statusbar required
        //   StatusBar.styleDefault();
        // }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('cursos', {
            url: '/cursos',
            // abstract: true,
            templateUrl: 'templates/cursos.html',
            controller: "CursosCtrl"
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/cursos');

});


app.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.onErrorSrc) {
              attrs.$set('src', attrs.onErrorSrc);
            }
          });
        }
    }
});