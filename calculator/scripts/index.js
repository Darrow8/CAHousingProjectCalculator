
let userLoc = {}; // ex: {latitude: 123, longitude:123}
var map;// the map


/**
 * Called once page has loaded
 */
window.onload = function() {
    // get position
    initMap();
    getLocation();
    // onClickMap()
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
  
function showPosition(position) {
    userLoc.latitude = position.coords.latitude;
    userLoc.longitude = position.coords.longitude;
    console.log("Latitude: " + position.coords.latitude +
    " Longitude: " + position.coords.longitude);

}

/**
 * Initialize Mapbox map
 */
function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fob3VzaW5nIiwiYSI6ImNrcWd6cHJpbTFobGwyeG52amNxYXl6cTQifQ.fwhEg-7LcyxLg0kl9cSEWw';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 4.5,
      center: [-119.417931, 36.778259]
    });

    var marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-122.25948, 37.87221]) // Marker [lng, lat] coordinates
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

