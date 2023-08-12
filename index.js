const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");

const searchForm =document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");

const userInfoContainer= document.querySelector(".user-info-container");

const cityName=document.querySelector("[data-cityName]");
const countryIcon=document.querySelector("[data-countryIcon]");
const desc=document.querySelector("[data-weatherDesc]");
const temp=document.querySelector("[data-temp]");
const weatherIcon=document.querySelector("[data-weatherIcon]");

const windspeed=document.querySelector("[data-windspeed]");
const humidity=document.querySelector("[data-humidity]");
const cloudiness=document.querySelector("[data-cloudiness]");
const grantAccessBtn=document.querySelector("[data-grantAcess]");
const userInput=document.querySelector("[data-searchInput]");

const cityError=document.querySelector("[not-found]");

const API_KEY="d1845658f92b31c64bd94f06f7188c9c"; 
let currentTab=userTab;
getfromSessionStorage();

currentTab.classList.add("current-tab");

function switchTab(newTab){

    cityError.classList.remove("active");
    userInput.value="";
    // means we clicked on other tab
    if(currentTab!=newTab){
        currentTab.classList.remove("current-tab");
        currentTab=newTab;
        currentTab.classList.add("current-tab");

        // if we comes in this if condition this indicates that
        // we have clicked on different tab and want new screen

        // how we indicate on which screen we want to come 
        // suppose you are present on your weather and you clicked on search weather
        // the newtab contains the search weather element 
        // we want the screen related to search weather will show => the form element should does not 
        // contain that active class => add it

        // show the screen 3
        if(currentTab==searchTab){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // mean dispay the screen 1 or screen 2 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // on which screen we will go screen 1 or screen 2 
            // check wheater we have grant access to location if yes
            // than the variables corresponding to location will be save 
            // in local storage else show screen 1
            getfromSessionStorage();
        }
    }
};

function getfromSessionStorage(){
    // through this we will check if the browser contains the user location coordinates
    const localcoordinates = sessionStorage.getItem("userCoordinates");
    
    // screen 1 show if no coordinates not found
    if(!localcoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        // means present get the weather of the location update the screen 2 and 
        // put the weather corresponding to it
        const coordinates=JSON.parse(localcoordinates);
        // here coordinates will be JSON format and we will call the API
        fetchWeatherInfo(coordinates);
    }
};

// this indicates that there is coordinates of the user
async function fetchWeatherInfo(coordinates){
    const{lat,lon}=coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response= await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    } catch (e) {
        loadingScreen.classList.remove("active");
        // searchForm.classList.add("active"); add alert
        cityError.classList.add("active");
    }

};

// put value in screen 2
function renderWeatherInfo(data){
    if(data?.cod=="404"){
        userInfoContainer.classList.remove("active");
        cityError.classList.add("active");
        grantAccessContainer.classList.remove("active");
    }
    else{
        cityName.innerText = data?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
        desc.innerText=data?.weather?.[0]?.description; 
        weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        temp.innerText=`${data?.main?.temp} C`;
        windspeed.innerText=`${data?.wind?.speed} m/s`;
        humidity.innerText=`${data?.main?.humidity} %`;
        cloudiness.innerText=`${data?.clouds?.all} %`; 
    
        let temperature=parseInt(data?.main?.temp)-273;
            console.log("comes");
        temp.innerText=`${temperature } °C`;
    }

};


userTab.addEventListener("click",()=>{
    
    // call the switchtab wala function and pass that tab
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    
    // call the switch tab wala function and pass that tab
    switchTab(searchTab);
});

grantAccessBtn.addEventListener("click",getlocation);


function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        // show alert for no geo location only search
    }
};

function showposition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    };
    // console.log("here 2");
    sessionStorage.setItem("userCoordinates",JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
};

// here e represents the element on which event happen

// userInput.addEventListener("click",()=>{
//     cityError.classList.remove("active");
// })

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let inputCity=userInput.value;

    if(inputCity===""){
        return ;
    }
    else{
        fetchWeatherCity(inputCity);
    }
});

async function fetchWeatherCity(city){

    userInfoContainer.classList.remove("active");
    cityError.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        let data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    catch (err) {
       loadingScreen.classList.remove("active");
        cityError.classList.add("active");
    }
};





  



