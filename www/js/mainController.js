angular
    .module('App')
    .controller('MainController', MainController);


/* @ngInject */
function MainController() {
    /* jshint validthis: true */
    var vm = this;
    vm.activate = activate;
    vm.title = 'MainController';
    vm.token = null;
    vm.number_of_current_events = 0;

    activate();

    //////////////////////////////////////// GOOGLE ////////////////////////////////////////

    vm.login = login;

    function login() {

        $.oauth2({
            auth_url: 'https://accounts.google.com/o/oauth2/auth',           // required
            response_type: 'code',      // required - "code"/"token"
            token_url: 'https://accounts.google.com/o/oauth2/token',          // required if response_type = 'code'
            logout_url: 'https://accounts.google.com/logout',         // recommended if available
            client_id: '435124131375-571j8bianm4e2rlp5ib5qicj3p54l0hm.apps.googleusercontent.com',          // required
            client_secret: 'ozILwWwXLpmNsgB1yCBiqgPU',      // required if response_type = 'code'
            redirect_uri: 'http://localhost/oauth2callback',       // required - some dummy url
            other_params: {
                'scope': 'https://www.googleapis.com/auth/calendar'
            }        // optional params object for scope, state, display...
        }, on_success, function(error, response){

            // do something with error object
            $("#logs").append("<p class='error'><b>error: </b>"+JSON.stringify(error)+"</p>");
            $("#logs").append("<p class='error'><b>response: </b>"+JSON.stringify(response)+"</p>");
        });

    }

    function on_success(token, response) {
        checkToken(token);
        vm.token = token;
    }


    function checkToken(token) {
        console.log('Token on success ', token );
        $.get('https://www.googleapis.com/calendar/v3/calendars/testfornith@gmail.com/events?' + 'access_token=' + token, ev_handler);

        function ev_handler(data) {

            busyChecker(data);
        }

        return vm.token = token;
    }

    function busyChecker(data) {
        console.log('Data', data);
        var today = new Date();
        for (var i = 0; i < data.items.length; i++) {
            vm.number_of_current_events = 0;
            var eventStartDate = new Date(data.items[i].start.dateTime);
            var eventEndDate = new Date(data.items[i].end.dateTime);


            if (+today >= +eventStartDate.valueOf() && +today <= +eventEndDate.valueOf()) {

                $("#logs").append("<p class='success'><b>All the events with token: </b>" + JSON.stringify(data.items[i].summary) + "</p>");
                vm.number_of_current_events += 1;
                busyUser();
            }
        }
        if (vm.number_of_current_events == 0) {
            $("#logs").append("<p class='success'><b>All the events with token: </b>" + JSON.stringify('No current events') + "</p>");
            freeUser();

        }

        return vm.number_of_current_events;
    }




    vm.test = test;

    function test() {
        console.log('Global value of token: ', vm.token);
    }


    window.setInterval(function(){
        /// call your function here
        console.log('Calling every 5 seg');
        if (vm.token) {
            checkToken(vm.token);
        }
        else {
            console.log('Waiting for token');
        }
    }, 5000);



    ///////////////////////////////////////// HUE /////////////////////////////////////////



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

    vm.createUser = createUser;
    vm.getConfig = getConfig;
    vm.getLuces = getLuces;
    vm.toggleLight = toggleLight;
    vm.switchColor = switchColor;



    /*VARIABLES*/
    vm.toggle = true;
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


    function freeUser() {
        user.setLightState(3, { on: vm.toggle, xy: [ 0.4084, 0.5168 ] }); /*GREEN LIGHT*/
    }

    function busyUser() {
        user.setLightState(3, { on: vm.toggle, xy: [ 0.6736, 0.3221] }); /*RED LIGHT*/
    }

    /////FUNCTIONS

    ////////////////

    function activate() {

    }


}