// codehelp -  https://api.openweathermap.org/data/2.5/weather?q=palam&appid=d1845658f92b31c64bd94f06f7188c9c&units=metric
// aditya jain - https://api.openweathermap.org/data/2.5/weather?q=palam&appid=da765148eb382769cde6373b649c6470&units=metric

const API_KEY = 'da765148eb382769cde6373b649c6470';

function renderWeatherInfo(data,city) {
    let temp = `${data?.main?.temp.toFixed(2)} °C`;
    let newPara = document.createElement('h1');
    newPara.textContent = city + " -> " +temp;
    document.body.appendChild(newPara);
}

// .toFixed(2) -> is a method that formats a number with a specified number of digits after the decimal point.

async function fetchWeatherDetails() {
    try {
        let city = 'palam';

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        console.log('weather data: ', data);
        renderWeatherInfo(data,city);  

    } catch (error) {
        console.log('error found');
    }
}

async function fetchRandomWeatherDetails() {
    try {
        let coord = {
            lon : 77.1,
            lat : 28.5667
        };

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        console.log('weather data: ', data);
        let city = `${data?.name}`;
        renderWeatherInfo(data,city);  

    } catch (error) {
        console.log('error found' , error);
    }
}

// how to get user current location -> lon & lat => navigator.geolocation.getCurrentPosition

function renderWeatherCoords(data) {
    let newPara = document.createElement('h1');
    newPara.innerHTML = data;
    document.body.appendChild(newPara);
}

function getLocation() {
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else { 
          err = "Geolocation is not supported by this browser.";
          renderWeatherCoords(err);
        }
    } catch (error) {
        err = `error -> ${error}`
        renderWeatherCoords(err);
    }
}

function showError(error) {
    // console.log(error);
    
    // switch(error.code) {
    //   case error.PERMISSION_DENIED:
    //     err = "User denied the request for Geolocation."
    //     renderWeatherCoords(err);
    //     break;
    //   case error.POSITION_UNAVAILABLE:
    //     err = "Location information is unavailable."
    //     renderWeatherCoords(err);
    //     break;
    //   case error.TIMEOUT:
    //     err = "The request to get user location timed out."
    //     renderWeatherCoords(err);
    //     break;
    //   case error.UNKNOWN_ERROR:
    //     err = "An unknown error occurred."
    //     renderWeatherCoords(err);
    //     break;
    // }

    console.log(`ERROR(${error.code}): ${error.message}`);
}

function showPosition(position) {
  data = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
  renderWeatherCoords(data);
}