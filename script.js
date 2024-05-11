APIKEY = '14442cab8be047b1a7245234240805';

// http://api.weatherapi.com/v1/forecast.json?key=14442cab8be047b1a7245234240805&q=kolkata&days=7&aqi=yes&alerts=yes

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById('city-name') 
const temp = document.getElementById('temp-c') 
const localTime = document.getElementById('loc-time') 
const skyCondition = document.getElementById('condition') 
const rain = document.getElementById('rain') 
const weatherCardsHour = document.getElementById('weather-cards-hour');
const weatherCardsWeek = document.getElementById('weather-cards-week');

const uvIndex = document.querySelector('.uv-index');
const uvText = document.querySelector('.uv-text');
const windSpeed = document.querySelector('.wind-speed');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const humidityStatus = document.querySelector('.humidity-status');
const visibility = document.querySelector('.visibility');
const visibilityStatus = document.querySelector('.visibility-status');
const feelsLike = document.querySelector('.feels-like');
const mainIcon = document.getElementById('icon');
const bodyBG = document.querySelector('body');


async function getData(APIKEY, cityInput){
    const promise = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${cityInput}&days=7&aqi=yes&alerts=yes`);
    return await promise.json();
}

searchBtn.addEventListener('click',async()=>{
    const input = cityInput.value;
    const result = await getData(APIKEY, input);
    
    items(result);

    updateForecast_hour(result.forecast.forecastday[0].hour, result.forecast.forecastday[0].hour);
        
    updateForecast_week(result.forecast.forecastday)

});
 

function getPublicIp(){
    fetch("http://ip-api.com/json/",
    {
        method:"GET",
    })
    .then((response)=> response.json())
    .then(async (data)=>{
        
        currentCity = data.city;

        const result = await getData(APIKEY, currentCity);

        items(result);

        updateForecast_hour(result.forecast.forecastday[0].hour, result.forecast.forecastday[0].hour);
        
        updateForecast_week(result.forecast.forecastday)

    });
}
getPublicIp();

function items(result) {
    cityName.innerText = `${result.location.name}, ${result.location.region}, ${result.location.country}`
    temp.innerText = result.current.temp_c;
    skyCondition.innerText = result.current.condition.text;
    rain.innerText = result.current.precip_mm + " mm";
    
    uvIndex.innerText = result.current.uv;
    measureUVindex(result.current.uv);
    windSpeed.innerText = result.current.wind_mph + " mph";
    humidity.innerText = result.current.humidity;
    measure_Humidity_Status(result.current.humidity);
    visibility.innerText = result.current.vis_km;
    measure_Visibility_Status(result.current.vis_km);
    feelsLike.innerText = result.current.feelslike_c + "°C";
    sunrise.innerText = result.forecast.forecastday[0].astro.sunrise;
    sunset.innerText = result.forecast.forecastday[0].astro.sunset;
    console.log(result.current.condition.text);

    bodyBG_img(result.current.condition.text);

}

function bodyBG_img(text) {
    let now = new Date();
    let hour = now.getHours();
    let arr = [18,19,20,21,22,23,0,1,2,3,4]
    
    let words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (words.includes("thunder") ) {
            bodyBG.style.backgroundImage = "url('assets/images/thunder.jpg')";
            mainIcon.src = "./assets/icons/rain/2.png";
            break;
        }else if ((words[i] == "rain" || words[i] == "Rain") && (!(arr.includes(hour))) ) {
            bodyBG.style.backgroundImage = "url('assets/images/rain2.jpeg')";
            mainIcon.src = "./assets/icons/rain/1.png";
            break;
        }else if ((words[i] == "rain" || words[i] == "Rain") && arr.includes(hour) ) {
            bodyBG.style.backgroundImage = "url('assets/images/rain2.jpeg')";
            mainIcon.src = "./assets/icons/rain/1.png";
            break;
        } else if (words[i] == "clear" && arr.includes(hour)) {
            bodyBG.style.backgroundImage = "url('assets/images/cn.jpg')"
            mainIcon.src = "./assets/icons/moon/1.png"
            break;
        } else if (words[i] == "cloudy" && arr.includes(hour)) {
            bodyBG.style.backgroundImage = "url('assets/images/pcn.jpg')"
            mainIcon.src = "./assets/icons/moon/2.png"
            break;
        } else if (words[i] == "cloudy" && (!(arr.includes(hour))) ) {
            bodyBG.style.backgroundImage = "url('assets/images/pc.jpg')"
            mainIcon.src = "./assets/icons/sun/2.png"
            break;
        }else if (words[i] == "Sunny") {
            bodyBG.style.backgroundImage = "url('assets/images/sunny.jpg')"
            mainIcon.src = "./assets/icons/sun/sun.png"
            break;
        }else if (arr.includes(hour)) {
            bodyBG.style.backgroundImage = "url('assets/images/night2.jpg')"
            mainIcon.src = "./assets/icons/moon/1.png"
        }else{
            bodyBG.style.backgroundImage = "url('assets/images/cd.jpg')"
            mainIcon.src = "./assets/icons/sun/sun.png"
        }
    }
}

function updateForecast_hour(data, time) {
    weatherCardsHour.innerHTML = "";
    let hour = 0;
    numCards_hour = 24;
    // console.log(data[day].condition.icon);
    for (let i = 0; i < numCards_hour; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        let timeAll = time[hour].time;
        let parts = timeAll.split(" ");
        let dayTime = getHour(parts[1]);

        let dayTemp = data[hour].temp_c;
        let iconCondition = data[hour].condition.icon;

        card.innerHTML = `
                <p class="day-name">${dayTime}</p>
                <div class="card-icon">
                    <img src="${iconCondition}" alt="" width="50">
                </div>
                <div class="day-temp">
                    <p class="temp">${dayTemp}°C</p>
                </div>
            `;

        weatherCardsHour.appendChild(card);
        hour++;
    }
}

function updateForecast_week(data) {
    weatherCardsWeek.innerHTML = "";

    let days = 0;
    let numCards = 7;
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        dayName = getDayName(data[days].date);
        
        let dayTempMax = data[days].day.maxtemp_c;
        let dayTempMin = data[days].day.mintemp_c;

        let iconCondition = data[days].day.condition.icon;
        console.log(iconCondition);

        card.innerHTML = `
                <p class="day-name">${dayName}</p>
                <div class="card-icon">
                    <img src="${iconCondition}" alt="" width="50">
                </div>
                <div class="day-temp">
                    <p class="temp">max: ${dayTempMax}°C</p>
                    <p class="temp">min: ${dayTempMin}°C</p>
                    
                </div>
            `;

        weatherCardsWeek.appendChild(card);
        days++;
    }
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour >= 12){
        hour = hour - 12;
        if(hour == "0"){
            return(`${12}:${min} PM`)
        }
        return(`${hour}:${min} PM`)
    }
    else{
        return(`${hour}:${min} AM`)
    }
}

function getDateTime(){
    let now = new Date();
    let hour = now.getHours();
    minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    let dayString = days[now.getDay()];
    return`${dayString}, ${hour}:${minute}`
}

// localTime.innerText = getDateTime();
//update time in every seconds
setInterval(()=>{
    localTime.innerText = getDateTime();
},1000)

//Get day Name
function getDayName(date){
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
}

//Measure UV index status
function measureUVindex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText = "low";
    }
    else if(uvIndex>2 && uvIndex<=5){
        uvText.innerText = "moderate";
    }
    else if(uvIndex>5 && uvIndex<=7){
        uvText.innerText = "high";
    }
    else if(uvIndex>7 && uvIndex<=10){
        uvText.innerText = "very high";
    }
    else{
        uvText.innerText = "extremely high";
    }

}
//Measure humidity status
function measure_Humidity_Status(humidity){
    if(humidity<=30){
        humidityStatus.innerText = "low";
    } 
    else if(humidity <= 60){
        humidityStatus.innerText = "Moderate";
    }
    else{
        humidityStatus.innerText = "high";
    }
}
//Measure visibility status
function measure_Visibility_Status(visibility){
    if(visibility <= 4){
        visibilityStatus.innerText = "low"
    }else if(visibility<=10){
        visibilityStatus.innerText = "fair"
    }
    else{
        visibilityStatus.innerText = "good"
    }
}








