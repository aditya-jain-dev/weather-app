// aditya jain - https://api.openweathermap.org/data/2.5/weather?q=palam&appid=da765148eb382769cde6373b649c6470&units=metric

// switching tab b/w your weather & search weather
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const grantAccessContainer = document.querySelector(".grand-location-container");
const showWeather = document.querySelector(".user-info-container");
const loadingScreen = document.querySelector(".loading-container");

// initially defined variables
const API_KEY = 'da765148eb382769cde6373b649c6470';
let currentTab = userTab;
currentTab.classList.add("current");

getFromSessionStorage();

// event listener on tab

userTab.addEventListener('click', () => {
    switchTab(userTab);
})

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
})

// switching tab b/w currentTab and clickedTab
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current")
        currentTab = clickedTab;
        currentTab.classList.add("current");

        if(!searchForm.classList.contains('active')){
            // inside -> userTab => switch to -> searchTab
            //kya search form wala container is invisible, if yes then make it visible
            searchForm.classList.add('active');
            showWeather.classList.remove('active');
            grantAccessContainer.classList.remove('active');
        }
        else{
            //me pehle search wale tab pr tha, ab your weather tab visible karna h 
            // inside -> searchTab => switch to -> userTab
            searchForm.classList.remove('active');
            showWeather.classList.remove('active');

            // first check they have session storage of location or not
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getFromSessionStorage();
        }
        // console.log("Current Tab", currentTab);
    }
}

// Check if coordinates are already present in Session Storage
function getFromSessionStorage() {

    console.log("looking session storage...")

    const localCoordinates = sessionStorage.getItem('user-coordinates')

    if(localCoordinates){
        console.log('getting user coordinates');
        // if present
        const coordinates = JSON.parse(localCoordinates);

        console.log(coordinates);

        fetchUserWeatherInfo(coordinates);
    }
    else{
        console.log('user coordinates not save');
        
        // show for grant location access
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add('active');
    }
}

// grant location access 
const grantAccessBtn = document.querySelector('[data-grantAccess]');

grantAccessBtn.addEventListener('click', () => {
    console.log('click on grant access btn');

    loadingScreen.classList.add('active');
    grantAccessContainer.classList.remove('active');
    getLocation();
})

// Get Coordinates using geoLocation
function getLocation(){
    console.log('inside get loaction');
    try {
        if(navigator.geolocation){
            console.log('access location');
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        }
        else { 
            err = "Geolocation is not supported by this browser.";
            console.log(err);
        }
    } catch (error) {
        console.log(error);
    }
};

// Get User Coordinates
function showPosition(position){
    console.log('inside position coordinates');

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }

    console.log(userCoordinates);

    // store user coordinates
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}

function showError(error) {
    console.log(`ERROR(${error.code}): ${error.message}`);
}

// - - - - - - - - - - - -fetch data from API - user weather info- - - - - - - - - - - -

async function fetchUserWeatherInfo(coordinates){

    console.log('inside fetchUserWeatherInfo');

    const { lat, lon } = coordinates;

    // make grantcontainer invisible
    grantAccessContainer.classList.remove('active');

    // make loader visible
    loadingScreen.classList.add('active');

    // API Call
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await res.json();

        loadingScreen.classList.remove('active');
        showWeather.classList.add('active');

        renderWeatherInfo(data);
    } catch (error) {
        console.log(error);
        loadingScreen.classList.remove("active");
    }
}

// - - - - - - - - - - - -Render Weather Info- - - - - - - - - - - -

function renderWeatherInfo(data) {
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloud = document.querySelector('[data-cloud]');

    // fetch values from weatherINfo object and put it UI elements

    cityName.innerHTML = data?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;

    weatherDesc.innerHTML = data?.weather?.[0].description;

    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;

    temp.innerHTML = `${data?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerHTML = `${data?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerHTML = `${data?.main?.humidity}%`;
    cloud.innerHTML = `${data?.clouds?.all}%`;
}

// - - - - - - - - - - - -Search Weather Handling- - - - - - - - - - - -

const searchInp = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit', (e) => {
    const cityName = searchInp.value;
    console.log(cityName);

    e.preventDefault();

    if (cityName == '') {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
        searchInp.value = "";
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    showWeather.classList.remove('active');
    grantAccessContainer.classList.remove("active");

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await res.json();

        loadingScreen.classList.remove('active');
        showWeather.classList.add('active');

        renderWeatherInfo(data);
    } catch (error) {
        console.log(error);
    }
}
