
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
let other = document.getElementById('other');
let backBtn = document.getElementById('back');

let div = document.getElementById('other-total');

// checkboxes
let sewageC = document.getElementById('sewage-check');
let waterC = document.getElementById('water-check');
let gasC = document.getElementById('gas-check');
let electricC = document.getElementById('electric-check');
let otherC = document.getElementById('other-check');

//costs
let mainCost = document.getElementById('main-costs');
let sewageCost = document.getElementById('sewage-costs');
let waterCost = document.getElementById('water-costs');
let gasCost = document.getElementById('gas-costs');
let electricCost = document.getElementById('electric-costs');
let otherCost = document.getElementById('other-costs');


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
  switchSearchPosition()
  googleTranslateElement('uk');
  setSection('language')

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
    if(mobileCheck()){
      document.getElementById("map-input2")['value'] = userLoc.common_name;

    }else{
      document.getElementById("map-input")['value'] = userLoc.common_name;

    }

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
     let ret2 = countyLinksJSON;
     let isNeighborly = false;
    //     // new layer
        map.addSource(Object.keys(countyData)[i], { 'type': 'geojson', 'data': ret['features'][0] })
        //console.log(countyData[Object.keys(countyData)[i]])
        let firstOne = ''
        let isFirstOne = true;
        for(let j =0; j < ret2[0].length; j++){
          if(typeof ret2[0][j]['County_name'] === 'string'){
            if(ret2[0][j]['County_name'].toLowerCase() == Object.keys(countyData)[i].toLowerCase()){
              console.log(ret2[0][j])
              if(ret2[0][j]['Jurisdiction_URL'] == 'https://housing.ca.gov/eligibilityquiz.html'){
                isNeighborly = true;
              }else{
                isNeighborly = false;
  
              }
              if(firstOne == ''){
                firstOne = ret2[0][j]['Jurisdiction_URL'];
                isFirstOne = true;
              }else{
                if(firstOne != ret2[0][j]['Jurisdiction_URL']){
                  isFirstOne = false;
                }
              }
  
            }
          }
        }


        let fill = '#ffffff'
        if(isNeighborly == true){
          fill = '#46eb34'
        }else{
          if(isFirstOne){
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
  other.setAttribute('style','display:none;')
  backBtn.setAttribute('style','display:none;')

  sewage.setAttribute('style','display:none;')

  // step one
  q1.setAttribute('style','display:inline-block;')
  currentPage = 'q1'

}

function rent(){
  // //console.log('rent clicked!')
  needsUtilities = false;
  q1.setAttribute('style','display:none;')
  qa2.setAttribute('style','display:inline-block;')
  div.setAttribute('style','display:none;')
  backBtn.setAttribute('style','display:inline-block;')

  currentPage = 'qa2'
  updateBar(20)


}

function rentAndUtils(){
  needsUtilities = true;
  q1.setAttribute('style','display:none;')
  qb2.setAttribute('style','display:inline-block;')
  backBtn.setAttribute('style','display:inline-block;')

  currentPage = 'qb2'
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
  
  if(otherC.checked && !utilities.includes('other')){
    utilities.push('other')
  }else if(!otherC.checked && utilities.includes('other')){
      utilities.splice(utilities.indexOf('other'),1)
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
  if(utilities.includes('other')){
    other.setAttribute('style','display:inline-block;')

  }else{
    other.setAttribute('style','display:none;')

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
  if(utilities.includes('other')){
    utilitiesCost += parseInt(otherCost.value)

  }
  console.log(otherCost.value)
  console.log(utilitiesCost)
  // go to next page
  qa2.setAttribute('style','display:none;')
  q3.setAttribute('style','display:inline-block;')
  currentPage = 'q3'

  updateBar(70)
}

function addedTime(){
  monthF = monthsForward.value;
  monthO = monthsOwed.value
  //TODO: update to say "up to highEnd"
  lowEnd = money_round(0.25*monthF*(utilitiesCost+rentCost))
  highEnd = money_round(monthF*(utilitiesCost+rentCost))
  lowEndSpan.innerHTML = `$${lowEnd}`
  highEndSpan.innerHTML = `$${highEnd}`

  // go to next page
  q3.setAttribute('style','display:none;')
  cta.setAttribute('style','display:inline-block;')
  currentPage = 'cta'
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
let adder = document.getElementById('adder')
/**
 * Show where to go
 */
function goToLink(){
  console.log(countySelected);
  console.log(countyLinksJSON);
  console.log(countyLinksJSON[0].length)
  let allLinks = [];
  let linkname = []


  for (let i = 0; i < countyLinksJSON[0].length; i++) {
    const county = countyLinksJSON[0][i];
    try{
        if(county['County_name'].toLowerCase() == countySelected.toLowerCase()){

          allLinks.push(county['Jurisdiction_URL']);
          linkname.push(county['JURIS_NAME']);
          console.log('correct county!');
          console.log(county['County_name'].toLowerCase())
          console.log(county['Jurisdiction_URL'])
        }
    }catch(err){
      console.log('bad`')
    }
  }
  
  // allLinks = allLinks.filter (function (value, index, array) { 
  //   return array.indexOf (value) == index;
  // });
  // linkname = linkname.filter (function (value, index, array) { 
  //   return array.indexOf (value) == index;
  // });

  if(allLinks.length == 0){
    allLinks.push('https://hornellp-ca.neighborlysoftware.com/CaliforniaCovid19RentRelief/Participant')
    el2.push('neighborlysoftware')
  }

  console.log(allLinks)
  for (let i = 0; i < allLinks.length; i++) {
    const element = allLinks[i];
    let el2 = linkname[i]
    console.log(element)
    adder.innerHTML += `<a href="${element}">${el2}</a>`
    adder.innerHTML +=`<br>`

    
  }




  // window.open(link);
}


// check mobile -- https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

/**
 * To switch position of search for mobile -> desktop
 */
function switchSearchPosition(){
  if(mobileCheck()){
    // is mobile
    // console.log('mobile!')
    document.getElementById('search-div').setAttribute('style','display:none;')
    document.getElementById('map-div').setAttribute('style','width:100%; height:40vh')
    
    document.getElementById('search-div2').setAttribute('style',
      `  height: 50vh;
      width: 100%;
      display:inline-block;

      `
    )

  }else{
    // is not mobile
    // console.log('desktop!')

  }
}

let currentPage = '';
function back(){
  rentCost = 0;
  utilities = [];
  utilitiesCost = 1;
  if(currentPage == 'q1'){
    q1.setAttribute('style','display:none;')
    setSection('location')
    updateBar(0)
  }else if(currentPage == 'qa2'){
    qa2.setAttribute('style','display:none;')
    q1.setAttribute('style','display:inline-block;')
    updateBar(0)

  }else if(currentPage == 'qb2'){
    qb2.setAttribute('style','display:none;')
    q1.setAttribute('style','display:inline-block;')
    updateBar(0)

  }else if(currentPage == 'q3'){
    q3.setAttribute('style','display:none;')
    q1.setAttribute('style','display:inline-block;')
    updateBar(0)

  }else if(currentPage == 'cta'){
    updateBar(0)

    cta.setAttribute('style','display:none;')
    q1.setAttribute('style','display:inline-block;')
  }

}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("start");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  goToLink();
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}