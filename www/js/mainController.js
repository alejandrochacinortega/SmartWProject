angular
    .module('App')
    .controller('MainController', MainController);


/* @ngInject */
function MainController() {
    /* jshint validthis: true */
    var vm = this;

    vm.activate = activate;
    vm.title = 'MainController';

    activate();

    ////////////////

    function activate() {
    }


}