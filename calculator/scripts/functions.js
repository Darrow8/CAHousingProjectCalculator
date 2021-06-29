// CODE FROM PMPKIN APP
/** 
   * Converts coordinatess to addresses.
   * https://docs.mapbox.com/api/search/geocoding/
   */
 async function convertCordToAddress(lat, lng)
 {
   let proxyUrl = "https://quiet-spire-64375.herokuapp.com/";
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
     let proxyUrl = "https://quiet-spire-64375.herokuapp.com/";
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