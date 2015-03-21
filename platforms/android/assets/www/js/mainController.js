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
    var hue = jsHue();
    var user = null;

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

    /*var user = hue.bridge('192.168.1.160').user('testingnithapplica');
    console.log('user ', user);*/


    /*vm.setLight = user.setLight;*/



  /*  vm.getLights = user.getLights(getLightsSuccess, getLightsFailure);

    function getLightsSuccess(data) {
        console.log('Getting lights ', data)
    }

    function getLightsFailure(err) {
        console.log('ERROR getting lights ', err)
    }
*/

    vm.createUser = createUser;
    vm.getConfig = getConfig;
    vm.getLuces = getLuces;
    vm.toggleLight = toggleLight;
    vm.switchColor = switchColor;



    /*VARIABLES*/
    vm.toggle = false;
    /*Google calendar*/
    vm.busy = false;


    /////FUNCTIONS

    function createUser() {
        user = hue.bridge('192.168.1.160').user('testingnithapplicanith');
        console.log('user ', user);
        // create user account (requires link button to be pressed)
        user.create('testingnithapplicanith12', successUser, errorUser);
        return user;

        function successUser(data) {
            console.log('data ', data);
            console.log('user has been created ');
        }

        function errorUser(error) {
            console.log('Error creating the user: ', error);
        }
    }

    function getConfig() {
        console.log('Getting config...');
        vm.config = user.getConfig(onSuccess, onFailure);
        console.log('vn.config ', vm.config);

        function onSuccess(response) {
            console.log('response from config: ', response)
        }

        function onFailure(error) {
            console.log('ERROR CONFIG: ', error)
        }
    }

    function getLuces() {
        console.log('Getting lights');
        vm.lights = user.getLights(onSuccess, onFailure);
        console.log('vm.lights: ', vm.lights);

        function onSuccess(response) {
            console.log('response from lights: ', response)
        }

        function onFailure(error) {
            console.log('ERROR LIGHTS: ', error)
        }

    }

    function toggleLight() {
        vm.toggle = !vm.toggle;
        console.log('Toggleling lights');
        user.setLightState(3, { on: vm.toggle, xy: [ 0.4084, 0.5168 ] }); /*GREEN LIGHT*/
        user.setLightState(3, { on: vm.toggle, xy: [ 0.6736, 0.3221] }); /*RED LIGHT*/
    }

    function switchColor() {
        vm.busy = !vm.busy;
        console.log('Switching colors');
        if (vm.busy) {
            user.setLightState(3, { on: vm.toggle, xy: [ 0.6736, 0.3221] }); /*RED LIGHT*/
        }
        else {
            user.setLightState(3, { on: vm.toggle, xy: [ 0.4084, 0.5168 ] }); /*GREEN LIGHT*/
        }
    }



    /////FUNCTIONS

    ////////////////

    function activate() {

    }


}