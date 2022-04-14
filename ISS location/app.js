// create the map
const map = L.map('map');

//set the tile
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tile = L.tileLayer(tileURL, {attribution});
tile.addTo(map);

//set the ISS marker
const ISSicon = L.icon({
  iconUrl: 'ISS_spacecraft_model_1.png',
  iconSize: [50, 30],
  iconAnchor: [25, 15],
});
const marker = L.marker([0,0], {icon: ISSicon});

//update the iss position every 1.5 seconds
getISS();
const getISSinterval = setInterval(() => {
    getISS();
  }, 1500);

let flag = true;

async function getISS(){
  const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  const data = await response.json();
  const {latitude, longitude} = data;
  if(flag){
    map.setView([latitude,longitude], 3);
    flag = false;
  }
  marker.setLatLng([latitude, longitude]).addTo(map);
}