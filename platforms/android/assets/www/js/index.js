var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', function onDeviceReady() {
            angular.bootstrap(document, ['App']);
        }, false);
    }
    /*onDeviceReady: function() {
        console.log('Device is ready to use!')
    }*/
};

app.initialize();