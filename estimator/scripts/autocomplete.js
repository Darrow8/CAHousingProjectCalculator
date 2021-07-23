// initial version from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete
async function autocomplete(inp) {
    //console.log(inp)
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    let searchKey = inp.value;
    //console.log(searchKey)
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", async function(e) {
      //console.log('here!')

        //console.log(e);
        searchKey = inp.value;

        await getItems(searchKey).then((words)=>{
            //console.log(words)
            //convert words
            let arr = words.map(word => word['description'])
            //console.log(arr)

            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            // let arr = await getItems(searchKey);
            //console.log(arr);
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                  console.log('here!')
                    /*insert the value for the autocomplete text field:*/
                    console.log(this.getElementsByTagName("input"))
                    if(mobileCheck()){
                      inp.value = this.getElementsByTagName("input")[0].value;

                    }else{
                      inp.value = this.getElementsByTagName("input")[1].value;

                    }

                    //console.log('CLICKED HERE!')
                    // //console.log(inp.value)
                    fromAddrToMap(inp.value)

                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        })

        
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        // var x = document.getElementById(this.id + "autocomplete-list");
        // if (x) x = x.getElementsByTagName("div");
        // if (e.keyCode == 40) {
        //   /*If the arrow DOWN key is pressed,
        //   increase the currentFocus variable:*/
        //   currentFocus++;
        //   /*and and make the current item more visible:*/
        //   addActive(x);
        // } else if (e.keyCode == 38) { //up
        //   /*If the arrow UP key is pressed,
        //   decrease the currentFocus variable:*/
        //   currentFocus--;
        //   /*and and make the current item more visible:*/
        //   addActive(x);
        // } else if (e.keyCode == 13) {
        //   /*If the ENTER key is pressed, prevent the form from being submitted,*/
        //   e.preventDefault();
        //   if (currentFocus > -1) {
        //     /*and simulate a click on the "active" item:*/
        //     if (x) x[currentFocus].click();
        //   }
        // }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      //console.log('CLICKED HERE2!')
      // addMarker()
        closeAllLists(e.target);
    })
}




  // * cred to -> https://stackoverflow.com/questions/54998476/how-to-use-autocomplete-on-search-bar-on-ionic-4/54999338#54999338
  async function getItems(ev) 
  {
    let searchLoading = true; 
    let guessData = [];
    // set val to the value of the searchbar
    let val =ev;
    // if the value is an empty string don't filter the items
    if (val && (val.trim() !== '')) 
    { 
      let guesses = [];
      let proxyUrl = "https://quiet-spire-64375.herokuapp.com/";
      // * for actual places
      // ! Hardcoded California into it
      let googleKey = 'AIzaSyD-4w23HUWGbHG58XLtJBDDY0-Ci1vfhtE';
      let targetUrlAdresses = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURI(val)}%20California&key=${googleKey}&sessiontoken=1234567890`;
      await fetch(proxyUrl+targetUrlAdresses,
      {
        method: 'GET',
        // mode: 'no-cors',
        headers: 
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(async(response) => 
        {
          return response.json()
        }).then((res)=>{
          //console.log(res);
          res['predictions'].forEach( (place) =>  { guesses.push(place); } );
        })
        .catch((err) => { console.error(err); } )
      
      // guesses = this.shuffle(guesses);
      guessData = guesses; 
      searchLoading = false; 
      return guessData;
    }
    else 
    { 
      searchLoading = false; 
      guessData = [];
      return guessData;
    }
  }