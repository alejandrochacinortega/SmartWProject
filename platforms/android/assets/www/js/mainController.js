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

    console.log('Start working with HUE');
    var hue = jsHue(),
        user = null;

    hue.discover(
        function(bridges) {
            if(bridges.length === 0) {
                console.log('No bridges found. :(');
            }
            else {
                bridges.forEach(function(b) {
                    console.log('b is ', b);
                    console.log('Bridge found at IP address %s.', b.internalipaddress);
                    user = getUser(bridges);
                    console.log('User is: ', user);
                    onLightsReady();

                });
            }
        },
        function(error) {
            console.error(error.message);
        }
    );

    function getUser(bridges) {
        var user = null;

        bridges.forEach(function (bridge) {
            user = hue.bridge(bridge.internalipaddress).user('newdeveloper');
            return false;
        });

        return user;
    }

    function onLightsReady() {
        user.setLightState(2, {
            hue: 56470,
            sat: 255,
            bri: 102,
            on: false
        });
        user.setLightState(3, {
            hue: 56470,
            sat: 255,
            bri: 102,
            on: false
        });
        user.setLightState(1, {
            hue: 56470,
            sat: 255,
            bri: 102,
            on: false
        });

    }

    /*var user = hue.bridge('192.168.1.160').user('foo');
    console.log('user ', user);*/


    /*vm.setLight = user.setLight;*/



    /*vm.getLights = user.getLights(getLightsSuccess, getLightsFailure);

    function getLightsSuccess(data) {
        console.log('Getting lights ', data)
    }

    function getLightsFailure(err) {
        console.log('ERROR getting lights ', err)
    }


    vm.createUser = createUser;*/


    /////FUNCTIONS
/*
    function createUser() {
        // create user account (requires link button to be pressed)
        user.create('foo application', successUser, errorUser);

        function successUser(data) {
            console.log('data ', data);
            console.log('user has been created ');
        }

        function errorUser(error) {
            console.log('Error creating the user: ', error);
        }
    }

    function setLight() {
        console.log('Setting light');
    }

    function getLights() {
        console.log('Getting lights');
    }*/





    /////FUNCTIONS

    ////////////////

    function activate() {

    }


}