
let userLoc = {}; // ex: {latitude: 123, longitude:123, common_name:'1234 Orange Grove Ave'}
var map;// the map
let mapboxAPI = 'pk.eyJ1IjoiY2Fob3VzaW5nIiwiYSI6ImNrcWd6cHJpbTFobGwyeG52amNxYXl6cTQifQ.fwhEg-7LcyxLg0kl9cSEWw';


/**
 * Called once page has loaded
 */
window.onload = function() {
    initMap();
    // setLayers();
    // getLocation();
    // autocomplete(document.getElementById("map-input"));

  };

/**
 * Get user location
 * code from -- https://www.w3schools.com/html/html5_geolocation.asp
 */
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
  
async function showPosition(position) {
    userLoc.latitude = position.coords.latitude;
    userLoc.longitude = position.coords.longitude;
    console.log("Latitude: " + position.coords.latitude +
    " Longitude: " + position.coords.longitude);
  addMarker(userLoc.latitude,userLoc.longitude);
  await convertCordToAddress(userLoc.latitude,userLoc.longitude).then((addr)=>{
    // have addr
    console.log(addr);
    userLoc.common_name = addr['place_name'];
    document.getElementById("map-input")['value'] = userLoc.common_name;
  })
}

/**
 * Initialize Mapbox map
 */
function initMap(){
    mapboxgl.accessToken = mapboxAPI;
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 4.5,
      center: [-119.417931, 36.778259]
    });

}



function addMarker(lat,lng){
  console.log('here!')
  var marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([lng, lat]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map
}





/**
 * Click detection for map
 */
function onClickMap(){
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
        layers: ['chicago-parks']
        });
        if (!features.length) {
        return;
        }
        var feature = features[0];
        
        var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
        '<h3>' +
        feature.properties.title +
        '</h3>' +
        '<p>' +
        feature.properties.description +
        '</p>'
        )
        .addTo(map);
        });
}


// function setLayers()