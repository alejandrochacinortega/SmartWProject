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
        console.log('Start working with HUE');
        var hue = jsHue();

        hue.discover(
            function(bridges) {
                if(bridges.length === 0) {
                    console.log('No bridges found. :(');
                }
                else {
                    bridges.forEach(function(b) {
                        console.log('b is ', b);
                        console.log('Bridge found at IP address %s.', b.internalipaddress);
                    });
                }
            },
            function(error) {
                console.error(error.message);
            }
        );


        var user = hue.bridge('192.168.1.160').user('nith');

        // create user account (requires link button to be pressed)
        user.create('nith application');
    }


}