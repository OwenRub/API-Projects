const button = document.getElementById('get-weather');
const weatherContainer = document.getElementById('weather');
let coordenates;

// shows weather info if user clicks
weatherContainer.style.display = 'none';
button.addEventListener('click', getAndDisplayWeather);

if('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition( position => {
    coordenates = position.coords;
    showCoords( coordenates );
  }); 
}

function getAndDisplayWeather(){
  getWeather( coordenates )
      .then( weatherInfo => {
        weatherContainer.style.display = '';
        displayWeatherInfo(weatherInfo);
      });
}

async function getWeather({ latitude, longitude }){
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=a5700c1f459df90734430cd79661a065`);
    if(response.ok){
      const weatherInfo = await response.json();
      return weatherInfo;
    }
    else{
      return { failed: true, status: 'Error fetching data' };
    }
  }
  catch(err){
    console.log(err);
    return { failed: true, status: 'Error communicating with server' };
  }
}

function displayWeatherInfo( weatherInfo ){
  if(weatherInfo.failed) document.getElementById('description').textContent = weatherInfo.status;

  document.getElementById('description').textContent = capitalize(weatherInfo.weather[0].description);
  document.getElementById('icon').setAttribute('src', `http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`);
  document.getElementById('temp').textContent = `${Math.round(weatherInfo.main.temp)} °C`;
  document.getElementById('feel').textContent = Math.round(weatherInfo.main.feels_like);
  document.getElementById('max').textContent = Math.round(weatherInfo.main.temp_max);
  document.getElementById('min').textContent = Math.round(weatherInfo.main.temp_min);
  document.getElementById('name').textContent = weatherInfo.name;
  document.getElementById('pressure').textContent = weatherInfo.main.pressure;
  document.getElementById('humidity').textContent = weatherInfo.main.humidity;
  document.getElementById('wind').textContent = Math.round(weatherInfo.wind.speed*3.6);
}

function showCoords({ latitude, longitude }){
  document.getElementById('lat').textContent = latitude ?? 'No available';
  document.getElementById('lng').textContent = longitude ?? 'No available';
}

function capitalize( string ){
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}