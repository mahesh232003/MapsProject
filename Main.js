var myLatLng = { lat: 16.5062, lng: 80.6480 };
var mapOptions = {
    center: myLatLng,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.TERRAIN
};
//create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
// map.addMarker({location:myLatLng});
var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
  });
function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();
//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();
//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);
//define calcRoute function
function calcRoute() {
    //create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL
        // Draw a line showing the straight distance between the markers
    };
    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var dist=parseFloat(result.routes[0].legs[0].distance.text)*1.609344;
            // const output = document.querySelector('#output');
            // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + 
            // ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + 
            // dist + " KM .<br />Duration <i class='fas fa-hourglass-start'></i> : " + 
            // dist*0.2 + " Mins .</div>";
            // var routesSteps = [];
            var routes = result.routes;
            //alert(document.getElementById("from").value.lat());
            // var colors = ['red', 'green', 'blue', 'orange', 'yellow', 'black'];

            // for (var i = 0; i < routes.length; i++) {
            // var lat1,lat2,lon1,lon2;
            var op1,op2;
            // for (var i = 0; i < 1; i++) {
                var steps = routes[0].legs[0].steps;
                op1=new google.maps.LatLng(steps[0].start_location.lat(), steps[0].start_location.lng());
                op2=new google.maps.LatLng(steps[steps.length-1].end_location.lat(), steps[steps.length-1].end_location.lng());
                alert(op1);
                alert(op2);
                var dist = distance(op1.lat(),op1.lng(),op2.lat(),op2.lng());
                const path_sel = [
                    new google.maps.LatLng(op1),
                    new google.maps.LatLng(op2)
                    ];
                const line = new google.maps.Polyline({path: path_sel,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5,
                map: map});
                line.setMap(map);
                new google.maps.Marker({
                    position: op1,
                    map: map,
                    icon: {
                        path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
                        scale: .5,
                        fillColor: 'blue',
                        fillOpacity: .5,
                        strokeWeight: 0
                    },
                    title: op1.maneuver
                });
                new google.maps.Marker({
                    position: op2,
                    map: map,
                    icon: {
                        path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
                        scale: .5,
                        fillColor: 'blue',
                        fillOpacity: .5,
                        strokeWeight: 0
                    },
                    title: op2.maneuver
                });
            // }
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + 
            ".<br />To: " + document.getElementById("to").value + ".<br /> Flying distance <i class='fa fa-plane'></i> : " + 
            dist + " KM .<br />Duration <i class='fas fa-hourglass-start'></i> : " + 
            dist*0.2 + " Mins .</div>";
            // const output = document.querySelector('#output');
            // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + 
            // ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + 
            // d + " KM .<br />Duration <i class='fas fa-hourglass-start'></i> : " + 
            // d*0.2 + " Mins .</div>";
            //display route
            //directionsDisplay.setDirections(result);
            //var line = new google.maps.Polyline({path: [document.getElementById("from").value, document.getElementById("to").value], map: map});
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });

}
//create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
}
//google.maps.event.addDomListener(window, "load", alert("event"));
var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);