// CODE FROM PMPKIN APP
let proxyUrl = "https://quiet-spire-64375.herokuapp.com/";

/** 
   * Converts coordinatess to addresses.
   * https://docs.mapbox.com/api/search/geocoding/
   */
 async function convertCordToAddress(lat, lng)
 {
   let targetURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxAPI}&limit=1`

   console.log(targetURL);
   return await fetch(proxyUrl+targetURL, 
     {
       "method": "GET",
       "headers": {
         'Access-Control-Allow-Headers': "*",
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       }
     }).then((resp)=>{return resp.json()}).then((data)=>{
       console.log(data);

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
     console.log(targetUrl);
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
         console.log(data)
         let cords = {
             lng: data['features'][0]['center'][0],
             lat:data['features'][0]['center'][1]
         }
         console.log('COORDS:', cords)
 
         return cords;
 
       })
       .catch( (err) => { throw err } )
   }


  // ? getting boundaries from https://rapidapi.com/VanitySoft/api/boundaries-io-1/endpoints
  async function getBoundaries(county)
  {
    // * get bounds and convert to distance
    // let southwest = map.getBounds()['_sw'];
    // let northeast = map.getBounds()['_ne'];
    // //console.log(northeast['lat']);
    // let dist = latlngToMiles(northeast['lat'], northeast['lng'], southwest['lat'], southwest['lng']);
    // //console.log(dist);
    // * access boundary API
    return await new Promise(async (res, rej) => 
    {
      let target = `https://vanitysoft-boundaries-io-v1.p.rapidapi.com/reaperfire/rest/v1/public/boundary/county/${county}/state/CA`
      console.log(target);
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
     //console.log(φ1, φ2);
     // * earth rad in miles
     const earthRad = 3963;
     // * Haversine formula 
     let val1 = (Math.sin(φ1) * Math.sin(φ2));
     let val2 = Math.cos(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
     let dist = (earthRad * Math.acos(val1 + val2));
     return dist;
   }



// counties and links
   const countyData = {
    "Alameda County":1,
    "Alpine County":2,
    "Amador County":3,
    "Butte County":4,
    "Calaveras County":5,
    "Colusa County":6,
    "Contra Costa County":7,
    "Del Norte County":8,
    "El Dorado County":9,
    "Fresno County":["hello world"],
    "Glenn County":["hello world"],
    "Humboldt County":["hello world"],
    "Imperial County":["hello world"],
    "Inyo County":["hello world"],
    "Kern County":["hello world"],
    "Kings County":["hello world"],
    "Lake County":["hello world"],
    "Lassen County":["hello world"],
    "Los Angeles County":["hello world"],
    "Madera County":["hello world"],
    "Marin County":["hello world"],
    "Mariposa County":["hello world"],
    "Mendocino County":["hello world"],
    "Merced County":["hello world"],
    "Modoc County":["hello world"],
    "Mono County":["hello world"],
    "Monterey County":["hello world"],
    "Napa County":["hello world"],
    "Nevada County":["hello world"],
    "Orange County":["hello world"],
    "Placer County":["hello world"],
    "Plumas County":["hello world"],
    "Riverside County":["hello world"],
    "Sacramento County":["hello world"],
    "San Benito County":["hello world"],
    "San Bernardino County":["hello world"],
    "San Diego County":["hello world"],
    "San Francisco County":["hello world"],
    "San Joaquin County":["hello world"],
    "San Luis Obispo County":["hello world"],
    "San Mateo County":["hello world"],
    "Santa Barbara County":["hello world"],
    "Santa Clara County":["hello world"],
    "Santa Cruz County":["hello world"],
    "Shasta County":["hello world"],
    "Sierra County":["hello world"],
    "Siskiyou County":["hello world"],
    "Solano County":["hello world"],
    "Sonoma County":["hello world"],
    "Stanislaus County":["hello world"],
    "Sutter County":["hello world"],
    "Tehama County":["hello world"],
    "Trinity County":["hello world"],
    "Tulare County":["hello world"],
    "Tuolumne County":["hello world"],
    "Ventura County":["hello world"],
    "Yolo County":["hello world"],
    "Yuba County":["hello world"]
  }