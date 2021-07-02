
let userLoc = {}; // ex: {latitude: 123, longitude:123, common_name:'1234 Orange Grove Ave'}
var map;// the map
let mapboxAPI = 'pk.eyJ1IjoiY2Fob3VzaW5nIiwiYSI6ImNrcWd6cHJpbTFobGwyeG52amNxYXl6cTQifQ.fwhEg-7LcyxLg0kl9cSEWw';


/**
 * Called once page has loaded
 */
window.onload = async function() {
  // MAP CODE
    // initMap();
    // setLayers();
    // getLocation();
    // autocomplete(document.getElementById("map-input"));
  // CALC CODE
  questionProcess()
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


async function setLayers(){
  // for()
  map.on('load', async function () {

    console.log(countyData);

    let countyNames = (Object.keys(countyData));
    for(let i =0; i < countyNames.length; i++){
      await getBoundaries(countyNames[i]).then((ret)=>{
        console.log(ret['features'][0]);
        // new layer
        map.addSource(countyNames[i], { 'type': 'geojson', 'data': ret['features'][0] })
  
        let layer = {
          'id':countyNames[i],
          'type':'fill',
          'source': countyNames[i],
          'paint': 
          {
            'fill-color': '#ffffff'
          }
        }
        map.addLayer(layer);
  
  
      })
    }
     
  })
}



// questions:
let needsUtilities = false; 
let utilities = [];
let utilitiesCost = 1;
let rentCost = 0;
let monthF = 0;
let monthO = 0;
let lowEnd = 0;
let highEnd = 0;

let q1 = document.getElementById('q1');
let qb2 = document.getElementById('qb-2');
let qa2 = document.getElementById('qa-2');
let q3 = document.getElementById('q3');
let cta = document.getElementById('call-to-action')

//options

let sewage = document.getElementById('sewage');
let water = document.getElementById('water');
let gas = document.getElementById('gas');
let electric = document.getElementById('electric');
let div = document.getElementById('other');

// checkboxes
let sewageC = document.getElementById('sewage-check');
let waterC = document.getElementById('water-check');
let gasC = document.getElementById('gas-check');
let electricC = document.getElementById('electric-check');

//costs
let mainCost = document.getElementById('main-costs');
let sewageCost = document.getElementById('sewage-costs');
let waterCost = document.getElementById('water-costs');
let gasCost = document.getElementById('gas-costs');
let electricCost = document.getElementById('electric-costs');


//select
let monthsOwed = document.getElementById('mo');
let monthsForward = document.getElementById('mf');

//end values

let lowEndSpan = document.getElementById('low-end');
let highEndSpan = document.getElementById('high-end');


// rent or rent + util -> ronly (what is your mounth)
//util+r -> which utilities?

function questionProcess(){
  // initialization 
  q1.setAttribute('style','display:none;')
  qb2.setAttribute('style','display:none;')
  qa2.setAttribute('style','display:none;')
  q3.setAttribute('style','display:none;')
  cta.setAttribute('style','display:none;')
  water.setAttribute('style','display:none;')
  gas.setAttribute('style','display:none;')
  electric.setAttribute('style','display:none;')
  sewage.setAttribute('style','display:none;')

  // step one
  q1.setAttribute('style','display:inline-block;')

}

function rent(){
  // console.log('rent clicked!')
  needsUtilities = false;
  q1.setAttribute('style','display:none;')
  qa2.setAttribute('style','display:inline-block;')
  div.setAttribute('style','display:inline-block;')

}

function rentAndUtils(){
  needsUtilities = true;
  q1.setAttribute('style','display:none;')
  qb2.setAttribute('style','display:inline-block;')

}

function enteredUtils(){
  // set btns
  if(sewageC.checked && !utilities.includes('sewage')){
    utilities.push('sewage')
  }else if(!sewageC.checked && utilities.includes('sewage')){
      utilities.splice(utilities.indexOf('sewage'),1)
  }

  if(gasC.checked && !utilities.includes('gas')){
    utilities.push('gas')

  }else if(!gasC.checked && utilities.includes('gas')){
      utilities.splice(utilities.indexOf('gas'),1)
  }

  if(waterC.checked && !utilities.includes('water')){
    utilities.push('water')

  }else if(!waterC.checked && utilities.includes('water')){
      utilities.splice(utilities.indexOf('water'),1)
  }

  if(electricC.checked && !utilities.includes('electric')){
    utilities.push('electric')
  }else if(!electricC.checked && utilities.includes('electric')){
      utilities.splice(utilities.indexOf('electric'),1)
  }
  console.log(utilities)
  // go to next page
  qb2.setAttribute('style','display:none;')
  qa2.setAttribute('style','display:inline-block;')
  if(utilities.includes('water')){
    water.setAttribute('style','display:inline-block;')

  }else{
    water.setAttribute('style','display:none;')

  }
  if(utilities.includes('gas')){
    gas.setAttribute('style','display:inline-block;')
  }else{
    gas.setAttribute('style','display:none;')

  }
  if(utilities.includes('electric')){
    electric.setAttribute('style','display:inline-block;')

  }else{
    electric.setAttribute('style','display:none;')

  }
  if(utilities.includes('sewage')){
    sewage.setAttribute('style','display:inline-block;')

  }else{
    sewage.setAttribute('style','display:none;')
  }
  if(utilities.length == 0){
    div.setAttribute('style','display:none;')
  }
}



function addedCosts(){
  console.log(mainCost.value)
  console.log(sewageCost.value)
  console.log(waterCost.value)
  console.log(gasCost.value)
  console.log(electricCost.value)

  rentCost = mainCost.value;

  if(utilities.includes('sewage')){
    utilitiesCost += parseInt(sewageCost.value)
  }

  if(utilities.includes('gas')){
    utilitiesCost += parseInt(gasCost.value)

  }
  if(utilities.includes('water')){
    utilitiesCost += parseInt(waterCost.value)

  }
  if(utilities.includes('electric')){
    utilitiesCost += parseInt(electricCost.value)

  }
  // go to next page
  qa2.setAttribute('style','display:none;')
  q3.setAttribute('style','display:inline-block;')

}

function addedTime(){
  monthF = monthsForward.value;
  monthO = monthsOwed.value

  console.log(monthsForward.value)
  console.log(monthsOwed.value)
  console.log(monthF);
  console.log(utilitiesCost);
  console.log(rentCost);

  lowEnd = money_round(0.2*monthF*(utilitiesCost+rentCost))
  highEnd = money_round(0.8*monthF*(utilitiesCost+rentCost))
  lowEndSpan.innerHTML = `$${lowEnd}`
  highEndSpan.innerHTML = `$${highEnd}`
  console.log(lowEnd)
  console.log(highEnd)

  // go to next page
  q3.setAttribute('style','display:none;')
  cta.setAttribute('style','display:inline-block;')
}

// https://stackoverflow.com/questions/14968615/rounding-to-the-nearest-hundredth-of-a-decimal-in-javascript
//to round up to two decimal places
function money_round(num) {
  return Math.ceil(num * 100) / 100;
}