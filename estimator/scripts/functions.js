// CODE FROM PMPKIN APP
let proxyUrl = "https://quiet-spire-64375.herokuapp.com/";

/** 
   * Converts coordinatess to addresses.
   * https://docs.mapbox.com/api/search/geocoding/
   */
 async function convertCordToAddress(lat, lng)
 {
   let targetURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxAPI}&limit=1`

   //console.log(targetURL);
   return await fetch(proxyUrl+targetURL, 
     {
       "method": "GET",
       "headers": {
         'Access-Control-Allow-Headers': "*",
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       }
     }).then((resp)=>{return resp.json()}).then((data)=>{
       //console.log(data);

       return data['features'][0]
     })
     
     .catch( (err) => { console.error(err); } )
 }


  /** 
   * Converts addresses to coordinates.
   * https://developers.google.com/maps/documentation/geocoding/start 
   */
   async function convertAddressToCord(address)
   {
     // let promise = new Promise((res, rej) => 
     // {
     let targetUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxAPI}`;
     //console.log(targetUrl);
     return await fetch(proxyUrl+targetUrl,
       {
         method: 'GET',
         // mode: 'no-cors',
         headers: 
         {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
       })
       .then( async(response) => { return (await response.json()); } ).then((data)=>{
         //console.log(data)
         let cords = {
             lng: data['features'][0]['center'][0],
             lat:data['features'][0]['center'][1]
         }
         //console.log('COORDS:', cords)
 
         return cords;
 
       })
       .catch( (err) => { throw err } )
   }

   


  // ? getting boundaries from https://rapidapi.com/VanitySoft/api/boundaries-io-1/endpoints
  async function getBoundaries(county)
  {
    // * get bounds and convert to distance
    // * access boundary API
    return await new Promise(async (res, rej) => 
    {
      let target = `https://vanitysoft-boundaries-io-v1.p.rapidapi.com/reaperfire/rest/v1/public/boundary/county/${county}/state/CA`
      //console.log(target);
      await fetch(target, 
      {
        "method": "GET",
        "headers": 
        {
          "x-rapidapi-host": "vanitysoft-boundaries-io-v1.p.rapidapi.com",
          "x-rapidapi-key": "22ea4d601bmsh400707d28d1dd3fp12a0fdjsnbe0adaf44778"
        }
      })
        .then( async(response) => { res(await response.json()); } )
        .catch(err => { console.error(err); rej(err); } );
    })
  }



  /** 
   * Using the coordinates of two points, calculate and return distance between the two.  
   * Credit: https://www.movable-type.co.uk/scripts/latlong.html 
   * Credit: https://www.geeksforgeeks.org/program-distance-two-points-earth/#:~:text=For%20this%20divide%20the%20values,is%20the%20radius%20of%20Earth
   */
   function latlngToMiles(lat1, lng1, lat2, lng2) 
   {
     // * convert to rads
     const φ1 = lat1 * Math.PI / 180; 
     const φ2 = lat2 * Math.PI / 180;
     const λ1 = lng1 * Math.PI / 180;
     const λ2 = lng2 * Math.PI / 180;
     ////console.log(φ1, φ2);
     // * earth rad in miles
     const earthRad = 3963;
     // * Haversine formula 
     let val1 = (Math.sin(φ1) * Math.sin(φ2));
     let val2 = Math.cos(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
     let dist = (earthRad * Math.acos(val1 + val2));
     return dist;
   }



/**
 * counties and links -- all of the "true" counties are counties that are a part of the statewide (neighborly) program ONLY.  
 * The counties that are keys for arrays with links inside are counties that opted out of the state program and are instead in their local program.
 * If their first element in the array is "true", then they are in the state program and a local program. 
 * 
 *  */ 
   const countyData = {
    "Alameda":true,
    "Alpine":true,
    "Amador":true,
    "Butte":true,
    "Calaveras":true,
    "Colusa":true,
    "Contra Costa":true,
    "Del Norte":true,
    "El Dorado":true,
    "Fresno":[true,"https://www.apple.com/"],
    "Glenn":["https://www.apple.com/"],
    "Humboldt":["https://www.apple.com/"],
    "Imperial":["https://www.apple.com/"],
    "Inyo":["https://www.apple.com/"],
    "Kern":["https://www.apple.com/"],
    "Kings":["https://www.apple.com/"],
    "Lake":[true,"https://www.apple.com/"],
    "Lassen":["https://www.apple.com/"],
    "Los Angeles":["https://www.apple.com/"],
    "Madera":["https://www.apple.com/"],
    "Marin":["https://www.apple.com/"],
    "Mariposa":["https://www.apple.com/"],
    "Mendocino":["https://www.apple.com/"],
    "Merced":["https://www.apple.com/"],
    "Modoc":["https://www.apple.com/"],
    "Mono":[true,"https://www.apple.com/"],
    "Monterey":["https://www.apple.com/"],
    "Napa":["https://www.apple.com/"],
    "Nevada":["https://www.apple.com/"],
    "Orange":["https://www.apple.com/"],
    "Placer":["https://www.apple.com/"],
    "Plumas":["https://www.apple.com/"],
    "Riverside":["https://www.apple.com/"],
    "Sacramento":["https://www.apple.com/"],
    "San Benito":["https://www.apple.com/"],
    "San Bernardino":["https://www.apple.com/"],
    "San Diego":["https://www.apple.com/"],
    "San Francisco":[true,"https://www.apple.com/"],
    "San Joaquin":["https://www.apple.com/"],
    "San Luis Obispo":["https://www.apple.com/"],
    "San Mateo":["https://www.apple.com/"],
    "Santa Barbara":["https://www.apple.com/"],
    "Santa Clara":["https://www.apple.com/"],
    "Santa Cruz":["https://www.apple.com/"],
    "Shasta":["https://www.apple.com/"],
    "Sierra":["https://www.apple.com/"],
    "Siskiyou":["https://www.apple.com/"],
    "Solano":["https://www.apple.com/"],
    "Sonoma":["https://www.apple.com/"],
    "Stanislaus":["https://www.apple.com/"],
    "Sutter":["https://www.apple.com/"],
    "Tehama":["https://www.apple.com/"],
    "Trinity":["https://www.apple.com/"],
    "Tulare":["https://www.apple.com/"],
    "Tuolumne":["https://www.apple.com/"],
    "Ventura":["https://www.apple.com/"],
    "Yolo":["https://www.apple.com/"],
    "Yuba":["https://www.apple.com/"]
  }


  

//https://stackoverflow.com/questions/7346563/loading-local-json-file
 // required use of an anonymous callback,
// as .open() will NOT return a value but simply returns undefined in asynchronous mode!

let allCountyJSON = []; // the actual GEOJSON data
let countySelected = ''// the county the user selected earlier;
let countyLinksJSON = []; // the links to the counties' help pages


/**
 * Determine which county the user is in
 * @param {*} lat latitude of user
 * @param {*} lng longitude of user
 */
function determineCounty(lat,lng){
  // console.log('RAN!')
  // console.log(allCountyJSON)
  for(let i =0; i< allCountyJSON.length; i++){
    if(d3.geoContains(allCountyJSON[i],[lng, lat])){
      console.log(`at ${Object.keys(countyData)[i]}`)
      countySelected = Object.keys(countyData)[i];

    }else{
      // console.log(`not at ${Object.keys(countyData)[i]}`)
    }

  }  
}


const loadJSONLinks = (callback) => {
  // Object.keys(countyData)
  // //console.log(Object.keys(countyData))
  // for(let county of Object.keys(countyData)){
    const xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    // 1. replace './data.json' with the local path of your file
    xObj.open('GET',`./GIS_links.json`, true);
    xObj.onreadystatechange = () => {
        if (xObj.readyState === 4 && xObj.status === 200) {
            // 2. call your callback function
            callback(xObj.responseText);
        }
    };
    xObj.send(null);
  // }
}


const loadJSONCounty = (callback) => {
  // Object.keys(countyData)
  // //console.log(Object.keys(countyData))
  for(let county of Object.keys(countyData)){
    const xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    // 1. replace './data.json' with the local path of your file
    xObj.open('GET',`./CA/${county}.geo.json`, true);
    xObj.onreadystatechange = () => {
        if (xObj.readyState === 4 && xObj.status === 200) {
            // 2. call your callback function
            callback(xObj.responseText);
        }
    };
    xObj.send(null);
  }
}

const init = () => {
  //console.log('here!')

  loadJSONCounty((response,) => {
      const json = JSON.parse(response);
      allCountyJSON.push(json)
  });
  loadJSONLinks((response,) => {
    const json = JSON.parse(response);
    console.log(json)
    countyLinksJSON.push(json);
  });

}

init();

