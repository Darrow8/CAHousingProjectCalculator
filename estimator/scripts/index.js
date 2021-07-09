
let userLoc = {}; // ex: {latitude: 123, longitude:123, common_name:'1234 Orange Grove Ave'}
var map;// the map
let mapboxAPI = 'pk.eyJ1IjoiY2Fob3VzaW5nIiwiYSI6ImNrcWd6cHJpbTFobGwyeG52amNxYXl6cTQifQ.fwhEg-7LcyxLg0kl9cSEWw';
let marker; // the marker 


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

// pages
let locationDiv = document.getElementById('locator-div'); // the location section
let calcDiv = document.getElementById('estimator-div'); // the calculator section
let langDiv = document.getElementById('select-language-div'); // the language section


/**
 * Called once page has loaded
 */
window.onload = async function() {
  googleTranslateElementInit();
  setSection('location')
  // MAP CODE
    initMap();
    setLayers();
    getLocation();
    autocomplete(document.getElementById("map-input"));
    await onClickMap();
  // CALC CODE
  questionProcess()
  // updateBar(0)
  };


/**
 * Specify which section should be present
 * @param section - the name of the section you want (language, location, or calculator)
 */
function setSection(section){
  switch (section) {
    case 'language':
      //console.log('here123')
      locationDiv.setAttribute('style','display:none;')
      calcDiv.setAttribute('style','display:none;')
      langDiv.setAttribute('style','display:inline-block;width:100%;')
    break;
    case 'location':
      locationDiv.setAttribute('style','display:inline-block;width:100%;')
      calcDiv.setAttribute('style','display:none;')
      langDiv.setAttribute('style','display:none;')
      break;
    case 'calculator':
      locationDiv.setAttribute('style','display:none;')
      calcDiv.setAttribute('style','display:inline-block; width:100%;')
      langDiv.setAttribute('style','display:none;')
      break;
    default:
      //console.log(`Error, this section does not exist: ${section}.`);
  }
}


let locInterval; //! This is a bad solution for now but it can be changed later.
/**
 * Get user location
 * code from -- https://www.w3schools.com/html/html5_geolocation.asp
 */
function getLocation() {


  navigator.geolocation.watchPosition(function(position) {
    //console.log("i'm tracking you!");
    //console.log(position)
    showPosition(position)
  },
  function(error) {
    if (error.code == error.PERMISSION_DENIED)
      //console.log("you denied me :-(");
      locInterval = setInterval(()=>{
        // //console.log('getting!')
        repgetLocation()
      },1000)
  });

}

/**
 * Get user location repeatedly to make sure they have not already done it
 * code from -- https://www.w3schools.com/html/html5_geolocation.asp
 */
function repgetLocation(){
  // //console.log('going!')
  navigator.geolocation.watchPosition(function(position) {
    //console.log("i'm tracking you!");
    //console.log(position)
    showPosition(position)
  });
}

  
async function showPosition(position) {
    userLoc.latitude = position.coords.latitude;
    userLoc.longitude = position.coords.longitude;
    //console.log("Latitude: " + position.coords.latitude +
    // " Longitude: " + position.coords.longitude);
  determineCounty(userLoc.latitude,userLoc.longitude)
  await addMarker(userLoc.latitude,userLoc.longitude).then(()=>{
    // you can continue!
    locContinueBtn.disabled = false;

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

// let inputMap = document.getElementById('map-input')
// inputMap.onkeypress = function(e){
//   if (!e) e = window.event;
//   var keyCode = e.code || e.key;
//   if (keyCode == 'Enter'){
//     // Enter pressed
//     //console.log(inputMap.value)

//     return false;
//   }
// }


// * function to add a marker onto the map
async function addMarker(lat,lng){
  if(marker != undefined){ // remove old marker
    marker.remove()
  }

  //console.log('here!')
  marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([lng, lat]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map
  // center the marker
  map.setZoom(7);
  map.setCenter([lng, lat]);
  //console.log(lat,lng)

  await convertCordToAddress(lat,lng).then((addr)=>{
    // have addr
    //console.log(addr);
    userLoc.common_name = addr['place_name'];
    document.getElementById("map-input")['value'] = userLoc.common_name;

  })



}





/**
 * Click detection for map
 */
async function onClickMap(){
    map.on('click', async function (e) {
      // //console.log(e);
      let lngLat = e['lngLat']; // {lng:123,lat:123}
      determineCounty(lngLat['lat'],lngLat['lng'])
      await addMarker(lngLat['lat'],lngLat['lng']).then(()=>{
        locContinueBtn.disabled = false;
      })
      
        })
}


async function setLayers(){
  // for()
  map.on('load', async function () {

    //console.log(countyData);


    for(let i =0; i < allCountyJSON.length; i++){
    //   await getBoundaries(countyNames[i]).then((ret)=>{
    //     //console.log(ret['features'][0]);
    let ret = allCountyJSON[i]
    //     // new layer
        map.addSource(Object.keys(countyData)[i], { 'type': 'geojson', 'data': ret['features'][0] })
        //console.log(countyData[Object.keys(countyData)[i]])
        let fill = '#ffffff'
        if(countyData[Object.keys(countyData)[i]] == true){
          fill = '#46eb34'
        }
        if(countyData[Object.keys(countyData)[i]].length != undefined){
          if(countyData[Object.keys(countyData)[i]][0] === true){
            fill = '#824824'
          }else{
            fill = '#eb8f34'
          }
        }

        let layer = {
          'id':Object.keys(countyData)[i],
          'type':'fill',
          'source': Object.keys(countyData)[i],
          'paint': 
          {
            'fill-color': fill,
            'fill-opacity': 0.5,
            'fill-outline-color': '#000'


          }
        }
        map.addLayer(layer);
  
  
    //   })
    }
     
  })
}



//CALCULATOR
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
  // //console.log('rent clicked!')
  needsUtilities = false;
  q1.setAttribute('style','display:none;')
  qa2.setAttribute('style','display:inline-block;')
  div.setAttribute('style','display:none;')
  updateBar(20)


}

function rentAndUtils(){
  needsUtilities = true;
  q1.setAttribute('style','display:none;')
  qb2.setAttribute('style','display:inline-block;')
  updateBar(10)


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
  //console.log(utilities)
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
  updateBar(40)

}



function addedCosts(){
  //console.log(mainCost.value)
  //console.log(sewageCost.value)
  //console.log(waterCost.value)
  //console.log(gasCost.value)
  //console.log(electricCost.value)

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

  updateBar(70)
}

function addedTime(){
  monthF = monthsForward.value;
  monthO = monthsOwed.value

  lowEnd = money_round(0.2*monthF*(utilitiesCost+rentCost))
  highEnd = money_round(monthF*(utilitiesCost+rentCost))
  lowEndSpan.innerHTML = `$${lowEnd}`
  highEndSpan.innerHTML = `$${highEnd}`

  // go to next page
  q3.setAttribute('style','display:none;')
  cta.setAttribute('style','display:inline-block;')
  updateBar(100)

}

// https://stackoverflow.com/questions/14968615/rounding-to-the-nearest-hundredth-of-a-decimal-in-javascript
//to round up to two decimal places
function money_round(num) {
  return Math.ceil(num * 100) / 100;
}

function updateBar(count){
  var pcg = Math.floor(count);        
  try{
    document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow',pcg);
    document.getElementsByClassName('progress-bar').item(0).setAttribute('style','width:'+Number(pcg)+'%');
  }
  catch(err){
    //console.log(err);
  }
}


// once addr is clicked
async function fromAddrToMap(addr){
  //console.log(addr);
  await convertAddressToCord(addr).then(async(userLoc)=>{
    //console.log(userLoc)
    determineCounty(userLoc.lat,userLoc.lng)
  await addMarker(userLoc.lat,userLoc.lng).then(()=>{
    // you can continue!
    locContinueBtn.disabled = false;

  })
  })

}
let locContinueBtn = document.getElementById("tocalcbtn")

function toCalc(){
  //console.log('calc!')
  setSection('calculator')
  // goToLink();// !delete
}

let link = '';
/**
 * Show where to go
 */
function goToLink(){
  console.log(countySelected);
  console.log(countyLinksJSON);
  console.log(countyLinksJSON[0].length)
  for (let i = 0; i < countyLinksJSON[0].length; i++) {
    const county = countyLinksJSON[0][i];
    try{
        if(county['County_name'].toLowerCase() == countySelected.toLowerCase()){
          link = county['Jurisdiction_URL'];

          // console.log('correct county!');
          // console.log(county['County_name'].toLowerCase())
        }
    }catch(err){
      console.log('bad`')
    }
  }

  window.open(link);
}


/**
 * for google translate 
 * link --  https://www.geeksforgeeks.org/add-google-translate-button-webpage/
 */
function googleTranslateElementInit() { 
  new google.translate.TranslateElement(
      {pageLanguage: 'en'}, 
      'google_translate_element'
  ); 
} 
