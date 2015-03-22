angular.module('App', [
    'ngMaterial'
])

.run(function($rootScope, $timeout) {
    console.log('starting run');
    $timeout(function() {
        console.log('OFFICIAL START!')
    }, 3000);
});