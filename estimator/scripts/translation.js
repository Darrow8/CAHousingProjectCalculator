// translate all statements
let pageLang = 'English';


let langToCode = {
    'eng':'en',
    'chn':'zh',
    'esp':'es',
    'kor':'ko',
    'viet':'vi',
    'tag':'tl'
}

/**
 * to set google translate
 * link --  https://www.geeksforgeeks.org/add-google-translate-button-webpage/
 */
 function googleTranslateElement(lang) { 
     console.log(lang)
    new google.translate.TranslateElement(
        {pageLanguage: lang}, 
        'google_translate_element'
    ); 
    new google.translate.TranslateElement(
      {pageLanguage: lang}, 
      'google_translate_element1'
    ); 
    new google.translate.TranslateElement(
        {pageLanguage: lang}, 
        'google_translate_element2'
      ); 
  } 
  
  function setLang(){
    let googleT = document.getElementById('google_translate_element');
    let googleTChild = googleT.childNodes[0].childNodes[0];
    let selector = googleTChild.getElementsByTagName("select")[0];
    console.log(googleTChild)
    console.log(selector);
    selector.value = 'bg';
    googleTranslateElement('bg')

  }


/**
 * To select language in first page
 * @param {string} lang 
 */
  function selectLang(lang){
    // console.log('here!');
    setLang();
    let newLang = langToCode[lang]
    console.log(newLang)
    googleTranslateElement(newLang)

    switch(lang){
        case 'eng': //english
            console.log('eng')
            break;


        case 'chn': //chinese
            console.log('chn')
            break;

        case 'esp': // spanish
            console.log('esp')
            break;
        
        case 'kor': //korean
            console.log('kor') 
            break;

        case 'viet': //vietnamese
            console.log('viet')
            break;
            
        case 'tag': //taglog
            console.log('tag') 
            break;

    }

    
}


async function continueLang(){
  // MAP CODE
  setSection('location')

  initMap();
  await setLayers();
  getLocation();
  if(mobileCheck()){
    autocomplete(document.getElementById("map-input2"));

  }else{
    autocomplete(document.getElementById("map-input"));

  }

  await onClickMap();
// CALC CODE
  questionProcess()

// updateBar(0)
}