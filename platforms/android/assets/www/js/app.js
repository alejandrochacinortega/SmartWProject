angular.module('App', [
    'ngMaterial',
    'ui.router'
])

.run(function($rootScope, $timeout) {
    console.log('starting run');
    $timeout(function() {
        console.log('OFFICIAL START!')
    }, 3000);
})

.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    //
    // Now set up the states
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'MainController as vm'
        })
        .state('main', {
            url: "/main",
            templateUrl: "templates/main.html",
            controller: 'MainController as vm'
        })
});