angular
    .module('App')
    .controller('MainController', ['$scope', '$mdToast', '$state', '$timeout', MainController]);


/* @ngInject */
function MainController($scope, $mdToast, $state, $timeout) {
    /* jshint validthis: true */
    var vm = this;
    vm.activate = activate;
    vm.title = 'MainController';
    vm.token = null;
    vm.number_of_current_events = 0;


    /*VARIABLES*/
    vm.toggle = true;
    vm.cityname = '';
    vm.checkWeather = checkWeather;
    /*Google calendar*/
    vm.busy = false;
    var hue = jsHue();
    var user = null;
    var weatherAPIkey = 'bb40fccaf1b9a523505913790c4077d6';
    /*var cityname = "Oslo";*/

    vm.weathercond = null;

    activate(hue);


    /*FUNCTIONS*/

    vm.createUser = createUser;
    vm.getConfig = getConfig;
    vm.getLuces = getLuces;
    vm.toggleLight = toggleLight;
    vm.switchColor = switchColor;

    /*$scope.toastPosition = {
     bottom: false,
     top: true,
     left: false,
     right: true
     };*/


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
        }, on_success, function (error, response) {

            // do something with error object
            //$("#logs").append("<p class='error'><b>error: </b>"+JSON.stringify(error)+"</p>");
            //$("#logs").append("<p class='error'><b>response: </b>"+JSON.stringify(response)+"</p>");
        });

    }

    function on_success(token, response) {
        $state.go('main');
        console.log('SHOW TOAST!!');
        $mdToast.show({
            /*template: '<md-toast class="md-warn">You have logged in :)</md-toast>',*/
            template: '<md-toast><span flex>You have successfully logged in :)</span></md-toast>',
            hideDelay: 2000
        });
        checkToken(token);
        vm.token = token;
    };


    function checkToken(token) {
        console.log('Token on success ', token);
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
                vm.number_of_current_events += 1;
                busyUser();
            }
        }
        if (vm.number_of_current_events == 0) {
            freeUser();
        }

        return vm.number_of_current_events;
    }


    vm.test = test;

    function test() {
        console.log('Global value of token: ', vm.token);
    }


    /*window.setInterval(function () {
        /// call your function here
        console.log('Calling every 5 seg');
        if (vm.token) {
            checkToken(vm.token);
        }
        else {
            console.log('Waiting for token');
        }
    }, 3000);*/

    window.setInterval(function(){
        /// call your function here
        console.log('Weather check every 20 sec');
        checkWeather(vm.cityname);
    }, 5000);

    ///////////////////////////////////////// HUE /////////////////////////////////////////


    /////FUNCTIONS

    function createUser() {
        user = hue.bridge('192.168.1.161').user('testingnithapplicanithhome');
        /*console.log('user ', user);*/ /*UNCOMMENT*/
        // create user account (requires link button to be pressed)
        user.create('testingnithapplicanithhome12', successUser, errorUser);
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

    function setWeatherColor(color) {
        switch(color) {
            case 'white' :
                user.setLightState(1, { on: vm.toggle, xy: [ 0.3333, 0.3333 ] }); /*WHITE LIGHT*/
                console.log(color);
                break;
            case 'yellow' :
                user.setLightState(1, { on: vm.toggle, xy: [ 0.5259, 0.4134 ] }); /*YELLOW LIGHT*/
                console.log(color);
                break;
            case 'red' :
                user.setLightState(1, { on: vm.toggle, xy: [ 0.700, 0.265 ] }); /*RED LIGHT*/
                console.log(color);
                break;
            case 'lightblue' :
                user.setLightState(1, { on: vm.toggle, xy: [ 0.2193, 0.1426 ] }); /*LIGHTBLUE LIGHT*/
                console.log(color);
                break;
            case 'blue' :
                user.setLightState(1, { on: vm.toggle, xy: [ 0.1684, 0.0416] }); /*BLUE LIGHT*/
                console.log(color);
                break;
            case 'darkblue' :
                user.setLightState(1, { on: vm.toggle, xy: [ 0.1684, 0.0416] }); /*DARKBLUE LIGHT*/
                console.log(color);
                break;
        }

    }

    function defaultColorLight() {
        console.log('Setting default color');
        user.setLightState(3, { on: true, xy: [ 0.1684, 0.0416] }); /*BLUE LIGHT*/
        /*user.setLightState(1, { on: true, xy: [ 0.1684, 0.0416] }); *//*WHITE LIGHT - For the weather indication light*/
    }

    function activate(hue) {
        console.log('Start working with HUE ');
        hue.discover(
            function(bridges) {
                if(bridges.length === 0) {
                    console.log('No bridges found. :(');
                }
                else {
                    bridges.forEach(function(b) {
                        console.log('b is ', b);
                        console.log('Bridge found at IP address %s.', b.internalipaddress);
                        createUser();
                        defaultColorLight();
                        checkWeather('Oslo');
                    });
                }
            },
            function(error) {
                console.error(error.message);
            }
        );

        return hue;
    }

    function checkWeather(cityname) {
        console.log('Checking weather of ', cityname);
        $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&type=accurate' + "&APPID=" + weatherAPIkey, answerHandler)
            .fail(onfail);
        function answerHandler(answer){
            console.log('ANSWER ', answer);
            vm.weathercond = null;
            //console.log( (answer['main']['temp']-273.15).toFixed(2));
            $.each(answer, function(key, val){
                if (key == 'weather'){
                    vm.weathercond=val[0]['id'];
                }
            });
            if (vm.weathercond != null) {
                console.log('WEATHERCOND ', vm.weathercond)
                defineWeatherLight(vm.weathercond);
            }
            /*else {
                console.log("Can't get weather condition code")
                console.log('ANSWER ELSE', answer);
            }*/

        }
        function onfail(answer){
            console.log('Can not get data from weather service, detailed response: ', answer)
        }
    }

    function defineWeatherLight(condition) {

        var condcode = parseInt(condition);
        var color = null;
        if (condcode > 199 && condcode < 300) {
            color = 'darkblue'; // thunderstorm + rain and so...
        }
        else if (condcode >= 300 && condcode < 600) {
            color = 'blue'; // drizzle, rain, heavy rain and so...
        }
        else if (condcode >=600 && condcode < 700) {
            color = 'lightblue'; // snow, heavy snow, sleet and so...
        }
        else if (condcode >=700 && condcode < 800) {
            color = 'white'; // mist, fog and so...
        }
        else if (condcode == 800) {
            color = 'yellow'; // clear sky...
        }
        else if (condcode >800 && condcode < 805) {
            color = 'white'; // clouds
        }
        else if (condcode >=900 && condcode < 907) {
            color = 'red'; // Extreme weather
        }
        else {
            color = 'white'; // Undefined look at http://openweathermap.org/weather-conditions
        }

        setWeatherColor(color);

        /*$mdToast.show({
            template: '<md-toast><span flex>' + color + '</span></md-toast>'
        });*/

    }



}