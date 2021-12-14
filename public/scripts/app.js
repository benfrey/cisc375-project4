let app;
let map;
let appLongitude;
let appLatitude;
let appAddress;
var markerArray= [];
let neighborhood_markers = 
[
    {location: [44.942068, -93.020521], marker: "Conway-Battlecreek-Highwood", number: 1},
    {location: [44.977413, -93.025156], marker: "Greater East Side", number: 2},
    {location: [44.931244, -93.079578], marker: "West Side", number: 3},
    {location: [44.956192, -93.060189], marker: "Dayton's Bluff", number: 4},
    {location: [44.978883, -93.068163], marker: "Payne-Phalen", number: 5},
    {location: [44.975766, -93.113887], marker: "North End", number: 6},
    {location: [44.959639, -93.121271], marker: "Frogtown", number: 7},
    {location: [44.947700, -93.128505], marker: "Summit-University", number: 8},
    {location: [44.930276, -93.119911], marker: "West Seventh", number: 9},
    {location: [44.982752, -93.147910], marker: "Como", number: 10},
    {location: [44.963631, -93.167548], marker: "Hamline-Midway", number: 11},
    {location: [44.973971, -93.197965], marker: "Saint Anthony", number: 12},
    {location: [44.949043, -93.178261], marker: "Union Park", number: 13},
    {location: [44.934848, -93.176736], marker: "Macalester-Groveland", number: 14},
    {location: [44.913106, -93.170779], marker: "Highland", number: 15},
    {location: [44.937705, -93.136997], marker: "Summit Hill", number: 16},
    {location: [44.949203, -93.093739], marker: "Downtown", number: 17}
];

function init() {
    let crime_url = 'http://localhost:8000';


    app = new Vue({
        el: '#app',
        data: {
            map: {
                center: {
                    lat: 44.955139,
                    lng: -93.102222,
                    address: ""
                },
                zoom: 12,
                bounds: {
                    nw: {lat: 45.008206, lng: -93.217977},
                    se: {lat: 44.883658, lng: -92.993787}
                }
            }
        }
    });

    map = L.map('leafletmap').setView([app.map.center.lat, app.map.center.lng], app.map.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);
    map.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);

      getJSON('http://localhost:8000/incidents?neighborhood=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17').then(result =>{
          for(var i=0; i<17; i++){
            var crimeArray = [];
              for(var j=0; j<result.length; j++){
                  if(result[j].neighborhood_number === i){
                      crimeArray.push(result[i])
                  }
              }
              marker = new L.marker(neighborhood_markers[i].location)
              .bindPopup(neighborhood_markers[i].marker+" neighborhood has had "+crimeArray.length+" crimes")
              .addTo(map);
              markerArray.push(marker);
          }
      });

    

    let district_boundary = new L.geoJson();
    district_boundary.addTo(map);

    getJSON('data/StPaulDistrictCouncil.geojson').then((result) => {
        // St. Paul GeoJSON
        $(result.features).each(function(key, value) {
            district_boundary.addData(value);
        });
    }).catch((error) => {
        console.log('Error:', error);
    });

    var app1 = new Vue({ 
        el: '#app-1',
        data: {
            message: 'hello world'
        }
    });

    appLatitude = new Vue({
        el: '#latitude',
        data: {
            lat: map.getBounds().getCenter().lat
        }
    });

    appLongitude = new Vue({
        el: '#longitude',
        data: function() {
            return{
                long: map.getBounds().getCenter().lng
            } 
        },
        computed: {
            getLongitude: function(){
                return this.long;
            }
        }
    })

    coordinatesToAddress(map.getBounds().getCenter().lat, map.getBounds().getCenter().lng);
    
    // console.log(coordinatesToAddress(map.getBounds().getCenter().lat, map.getBounds().getCenter().lng).resolve());
    
}

function updateMap(){
    console.log(markerArray)
    markerArray.forEach(marker =>{
        map.removeLayer(marker);
    })
    var latLng = L.latLng(L.latLng(appLatitude.lat, appLongitude.long));
    map.flyTo(latLng , 16);
    marker = new L.marker(latLng)
    .bindPopup(appLatitude.lat+" Latitude "+appLongitude.long+" longitude")
    .addTo(map);
    markerArray.push(marker);
}


function coordinatesToAddress(lat, long) {
    var url = "https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+long+"&zoom=18&addressdetails=1";
    // var url = "https://nominatim.openstreetmap.org/format=getjson&reverse?lat="+lat+"&lon="+long;
    return Promise.resolve(this.getJSON(url).then(resolve =>{
        this.appAddress = resolve;
        appAddress = new Vue({
            el: '#address',
            data: {
                addr: this.appAddress.address.house_number.toString() +" "+ this.appAddress.address.road 
            }
        });
    }));
}


function getJSON(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: "json",
            url: url,
            success: function(data) {
                resolve(data);
            },
            error: function(status, message) {
                reject({status: status.status, message: status.statusText});
            }
        });
    });
}
