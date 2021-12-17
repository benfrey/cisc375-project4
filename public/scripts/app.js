let app;
let map;
let longitude;
let latitude;
let fullAddress;
var tableArray = [];
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
          lat: 44.955139,
          longitude: -93.102222,
          address: "",
          incidentCodes: {},
          neighborhoodIDs: {},
          dStart: "",
          dEnd: "",
          tStart: "",
          tEnd: "",
          incidentCodeFilters: {},
          neighborhoodIDFilters: {},
          max: 1000,
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

    // Leaflet map
    map = L.map('leafletmap').setView([app.map.center.lat, app.map.center.lng], app.map.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);
    map.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);

      getJSON('http://localhost:8000/incidents?neighborhood=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17').then(result =>{
          this.tableArray = result;
            for(var x=0; x<tableArray.length; x++){
                str = tableArray[x].block;
                index = tableArray[x].block.indexOf("X");
                char = str[index];
                replaced = str.replace(char, "0");
                tableArray[x].block = replaced;
            }
          // this code should be illegal... like a nested for loop?...
          for(var i=0; i<17; i++){
            var crimeArray = [];
              for(var j=0; j<result.length; j++){
                  if(result[j].neighborhood_number === i){

                      crimeArray.push(result[i])
                  }
              }
              var myIcon = L.icon({
                  iconUrl: './images/neighborhood.png',
                  iconSize: [30, 30],
                  iconAnchor: [30, 30],
                  popupAnchor: [-15, -30],
              });
              marker = new L.marker(neighborhood_markers[i].location, {icon: myIcon})
              .bindPopup(neighborhood_markers[i].marker+" neighborhood has had "+crimeArray.length+" crimes")
              .addTo(map);
              markerArray.push(marker);
          }
      });


    this.longitude = map.getBounds().getCenter().lng;
    this.latitude = map.getBounds().getCenter().lat;
    map.on('moveend', function() {
        updateCenter();
        updateFilters();
    });
    map.on('dragend', function() {
        updateCenter();
        updateFilters();
    });
    map.on('zoomend', function(){
        updateCenter();
        updateFilters();
    });


    let district_boundary = new L.geoJson();
    district_boundary.addTo(map);;

    // Boundary for map
    getJSON('data/StPaulDistrictCouncil.geojson').then((result) => {
        // St. Paul GeoJSON
        $(result.features).each(function(key, value) {
            district_boundary.addData(value);
        });
    }).catch((error) => {
    });
    updateFilters();

}

// Selection of table row address
function selectTableRow(rowNum){
    row = tableArray[rowNum];
    //remove av, pa, rd,
    address = row.block + " saint paul minnesota"
    url = "https://nominatim.openstreetmap.org/search?q=" + address + "&format=json&accept-language=en";
    getJSON(url).then(resolve =>{
        try{
            this.fullAddress = resolve[0];
            this.latitude = this.fullAddress.lat;
            this.longitude = this.fullAddress.lon;
            markerArray.forEach(marker =>{
                map.removeLayer(marker);
            })
            var latLng = L.latLng(L.latLng(this.latitude, this.longitude));
            map.flyTo(latLng , 16);
            marker = new L.marker(latLng)
            .bindPopup("Date: " + row.date +
                       "<br/>Time: " + row.time +
                       "<br/>Address: " + row.block +
                       "<br/>Incident: " + row.incident +
                       '<br/><button type="button" onClick="deleteEntry('+ row.case_number + ')" style="color:red">Delete</button>')
            .addTo(map);
            markerArray.push(marker);
            updateValues();

        }catch{
            window.alert("this address could not be found");
        }

    })

}

// Create table at "codeBody" element
function createTable(){
    table = document.getElementById('codeBody');
    let i;
    var string = '';
    for (i = 0; i < tableArray.length; i++){
        var temp = tableArray[i];
        var cType = '<tr style=\'';

        // Color for table style
        if (temp.incident == 'Theft' || temp.incident == 'Auto Theft' || temp.incident == 'Burglary' || temp.incident == 'Vandalism' || temp.incident == 'Graffiti' || temp.incident == 'Robbery'){
            cType += 'background-color:rgb(125, 125, 185)\'>';
        }else if (temp.incident == 'Simple Asasult Dom.' || temp.incident == 'Agg. Assault' || temp.incident == 'Arson' || temp.incident == 'Agg. Assault Dom.' || temp.incident == 'Rape'){
            cType += 'background-color:rgb(185, 125, 125)\'>';
        }else{
            cType += 'background-color:rgb(125, 185, 125)\'>';
        }
        names = [
            "Conway-Battlecreek-Highwood", "Greater East Side", "West Side", "Dayton's Bluff", "Payne-Phalen","North End",
            "Frogtown","Summit-University","West Seventh","Como","Hamline-Midway","Saint Anthony","Union Park",
            "Macalester-Groveland","Highland","Summit Hill","Downtown"
                ]
        

        // Assemble each row
        var row = `
                        <td>${temp.case_number}</td>
                        <td>${temp.date}</td>
                        <td>${temp.time}</td>
                        <td>${temp.incident}</td>
                        <td>${temp.police_grid}</td>
                        <td>${names[temp.neighborhood_number-1]}</td>
                        <td>${temp.block}</td>
                        <td><button type="button" onClick="selectTableRow(${i})">Select</button></td>
                   </tr>
        `

        string += cType+row;
    }
    table.innerHTML = string;
}

// Pan map
function moveMap(){
    markerArray.forEach(marker =>{
        map.removeLayer(marker);
    })
    var latLng = L.latLng(L.latLng(this.latitude, this.longitude));
    map.flyTo(latLng , 16);
    marker = new L.marker(latLng)
    .bindPopup(this.latitude+" Latitude "+this.longitude+" longitude")
    .addTo(map);
    markerArray.push(marker);
    updateValues();
}

// Update value of latitude
function updateLatitude() {
    var lat = document.getElementById('latitude').value;
    this.latitude = lat;
    updateValues();
}

// Update value of longitude
function updateLongitude() {
    this.longitude = document.getElementById('longitude').value;
    updateValues();
}

// Update coords based on map center
function updateCenter() {
    this.longitude = map.getBounds().getCenter().lng;
    this.latitude = map.getBounds().getCenter().lat;
    updateValues();
}

// Change value attribute in real time
function updateValues() {
    lat = document.getElementById('latitude').setAttribute('value', this.latitude);
    lng = document.getElementById('longitude').setAttribute('value', this.longitude);
}

// This needs to be worked on...
function addressToCoordinates() {
    address = document.getElementById('address').value;
    address += " saint Paul Minnesota";
    url = "https://nominatim.openstreetmap.org/search?q=" + address + "&format=json&accept-language=en";
    return this.getJSON(url).then(resolve =>{
        this.fullAddress = resolve[0];
        this.latitude = this.fullAddress.lat;
        this.longitude = this.fullAddress.lon;
        
        updateValues();
        moveMap();
    })
}

// This needs to be worked on...
function coordinatesToAddress(lat, long) {
    var url = "https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+long+"&zoom=18&addressdetails=1";
    // var url = "https://nominatim.openstreetmap.org/format=getjson&reverse?lat="+lat+"&lon="+long;
    return Promise.resolve(this.getJSON(url).then(resolve =>{
        this.fullAddress = resolve;
    }));
}

// Delete case
function deleteEntry(caseNumber) {
  url = "http://localhost:8000/remove-incident?case_number=";
  url += caseNumber; // needs to be fed a value
  

  // Got URL, now delete
  deleteJSON(url).then(result =>{
    // No result data, just errors?
  }).catch(e => {
    if(e.status == 200){
      window.alert("Case "+caseNumber+" succesfully removed."); // alert user of deleted case
      // reset
      resetButton();
    } else {
      window.alert("Error deleting "+caseNumber+"."); // alert user of deleted case
    }
  });
}

// Filter button has been pushed, need new SQL query.
function updateFilters() {
    neighborhoodArray=[];
    incidentArray=[];
    //get visible neighborhoods on the map and add them to neighborhoodArray
    mapBounds = map.getBounds();
    visibleNeighborhoods =[]
    for(var i=0; i<neighborhood_markers.length; i++){
        latitude = neighborhood_markers[i].location[0];
        longitude = neighborhood_markers[i].location[1];
        if(latitude<mapBounds._northEast.lat && latitude>mapBounds._southWest.lat && longitude<mapBounds._northEast.lng && longitude > mapBounds._southWest.lng){
            visibleNeighborhoods.push(neighborhood_markers[i].number);
        }
    }
    console.log('visibleNeighborhoods', visibleNeighborhoods);
    neighborhoodArray = visibleNeighborhoods;

    $("input:checkbox[name=incident]:checked").each(function(){
        incidentArray.push($(this).val());
    });
    url = "http://localhost:8000/incidents";

    if(incidentArray.length>0){
        url += "?code="
        for(var i=0; i<incidentArray.length; i++){
            url += incidentArray[i]+"";
        }
        url = url.substring(0, url.length-1);
        
    }

    $("input:checkbox[name=neighborhood]:checked").each(function(){
        neighborhoodArray.push($(this).val());
    });
    

    if(neighborhoodArray.length>0){
        if(incidentArray.length=0){
            url += "&neighborhood="
        for(var i=0; i<neighborhoodArray.length; i++){
            url += neighborhoodArray[i]+",";
        }
        url = url.substring(0, url.length-1);
        }else{
            url += "?neighborhood="
            for(var i=0; i<neighborhoodArray.length; i++){
                url += neighborhoodArray[i]+",";
            }
        }
        url = url.substring(0, url.length-1);
        
    }

    dateStart = document.getElementById('dateStart').value;
    dateEnd = document.getElementById('dateEnd').value;
    maxIncidents = document.getElementById('maxIncidents').value;
    startTime = document.getElementById('startTime').value;
    endTime = document.getElementById('endTime').value;
   



    if(neighborhoodArray.length>0 || incidentArray.length>0){
        if(dateStart&&dateEnd){
            url+= "&start_date="+dateStart+"&end_date="+dateEnd;
        }else if(dateStart && !dateEnd){
            url+= "&start_date="+dateStart;
        }else if(!dateStart && dateEnd){
            url+= "&end_date="+dateEnd;
        }
    }else if(dateStart && dateEnd){
        url+= "?start_date="+dateStart+"&end_date="+dateEnd;
    }else if(dateStart && !dateEnd){
        url+= "?start_date="+dateStart;
    }else if(!dateStart && dateEnd){
        url+= "?end_date="+dateEnd;
    }

    if(maxIncidents){
        if(neighborhoodArray.length>0 || incidentArray.length>0 || dateStart || dateEnd){
            url += "&limit="+maxIncidents;
        }else{
            url += "?limit="+maxIncidents;
        }
    }
 

    // Got URL, so resolve by creating master tableArray that has been filtered.
    getJSON(url).then(resolve =>{
        this.tableArray = resolve;
        tempArray=[];
        for(var i=0; i<this.tableArray.length; i++){

            // Replace "X" with "0" (zero) so that location may be mapped properly.
            str = tableArray[i].block;
            index = tableArray[i].block.indexOf("X");
            char = str[index];
            replaced = str.replace(char, "0");
            tableArray[i].block = replaced;

            // Filter by time (i.e. remove values from master tableArray that do not fall in time range).
            if(startTime || endTime){
                if(startTime && !endTime){
                    if(tableArray[i].time > startTime ){
                        tempArray.push(tableArray[i]);
                    }
                }else if(!startTime && endTime){
                    if(tableArray[i].time < endTime ){
                        tempArray.push(tableArray[i]);
                    }
                }else if(startTime && endTime){
                    if(tableArray[i].time < endTime && tableArray[i] >startTime){
                        tempArray.push(tableArray[i]);
                    }
                }
            }
        }
        // Make the table
        this.tableArray = tempArray;
        createTable();
    });

}

// Delete datab
function deleteJSON(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: "json",
            type: "DELETE",
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

// Retrieve data with GET
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

// Reset page
function resetButton() {
  location.reload();
}
