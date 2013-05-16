    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
         var ref = window.open('http://www.blod.gr', '_blank', 'location=no');
    }