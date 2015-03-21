angular
    .module('App')
    .controller('MainController', MainController);


/* @ngInject */
function MainController() {
    /* jshint validthis: true */
    var vm = this;
    vm.activate = activate;
    vm.title = 'MainController';

    vm.setLight = setLight;
    vm.getLight = getLight;


    /////FUNCTIONS

    function setLight() {
        console.log('Setting light');
    }

    function getLight() {
        console.log('Getting light');
    }





    /////FUNCTIONS


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
        console.log('user ', user)

        // create user account (requires link button to be pressed)
        user.create('nith application', successUser, errorUser);

        function successUser(data) {
            console.log('data ', data)
            console.log('user has been created ');
        }

        function errorUser(error) {
            console.log('Error creating the user: ', error);
        }
    }


}