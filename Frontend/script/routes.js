//#region ***  DOM references                           ***********
const hostIP = `http://${window.location.hostname}:5000`;
let map;
let hiddenmap = 0;

let routeSelector = '';
let dateSelector = '';
let selectedRoute = '';
let gpxLayer = '';

let distanceCard = '';
let avgSpeedCard = '';
let fuelusageCard = '';
let fuelRateCard = '';
let costsCard = '';
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showRoutesMap = function () {
  map = L.map('mapid');
  L.tileLayer('img/mapTiles/{z}/{x}/{y}.png', { maxZoom: 14, minZoom: 11 }).addTo(map);
  document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';

  let gpxlocEmpty = 'empty.gpx';
  gpxLayer = new L.GPX(gpxlocEmpty, { async: true })
    .on('loaded', function (e) {
      map.fitBounds(e.target.getBounds());
    })
    .addTo(map);
};

const showClearedPage = function () {
  distanceCard.innerHTML = '--' + ' km';
  avgSpeedCard.innerHTML = '--' + ' km/h';
  fuelusageCard.innerHTML = '--' + ' L';
  fuelRateCard.innerHTML = '--' + ' L/100km';
  costsCard.innerHTML = '€ ' + '--';

  map.removeLayer(gpxLayer);
  let gpxlocEmpty = 'empty.gpx';
  gpxLayer = new L.GPX(gpxlocEmpty, { async: true })
    .on('loaded', function (e) {
      map.fitBounds(e.target.getBounds());
    })
    .addTo(map);
};

const showListOptions = function (jsonObject) {
  let newHTML = `<option value=""> Select Route:</option>`;
  let routectr = 0;
  for (d of jsonObject) {
    newHTML += `<option class="js-route-list-item" value="${routectr}">Route ${d['StartTime']}</option>`;
    routectr++;
  }
  routeSelector.innerHTML = newHTML;

  showClearedPage();
};

const showUpdateRouteInformation = function (jsonObject) {
  selectedRoute = jsonObject[routeSelector.value];

  distanceCard.innerHTML = Math.round(selectedRoute['Distance'] * 100) / 100 + ' km';
  avgSpeedCard.innerHTML = Math.round(selectedRoute['Average_Speed'] * 10) / 10 + ' km/h';
  fuelusageCard.innerHTML = Math.round(selectedRoute['Total_Fuel'] * 100) / 100 + ' L';
  fuelRateCard.innerHTML = Math.round(selectedRoute['Avg_Fuelrate'] * 10) / 10 + ' L/100km';
  costsCard.innerHTML = '€' + Math.round(selectedRoute['Total_Fuel'] * selectedRoute['Current_FuelPrice'] * 100) / 100;

  map.removeLayer(gpxLayer);
  let gpxloc = selectedRoute['GPX_File'];
  gpxLayer = new L.GPX(gpxloc, { async: true })
    .on('loaded', function (e) {
      map.fitBounds(e.target.getBounds());
    })
    .addTo(map);
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********

//#endregion

//#region ***  Data Access - get___                     ***********
const getAllRoutes = function () {
  handleData(`${hostIP}/api/data/routes/allroutes`, doSomething);
};

const getRoutesByDate = function (date) {
  handleData(`${hostIP}/api/data/routes/${date}`, showListOptions);
};

const getRoutesByDateRouteID = function (date) {
  handleData(`${hostIP}/api/data/routes/${date}`, showUpdateRouteInformation);
};
//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToMenuIcon = function () {
  document.querySelector('.openSidebarMenu').addEventListener('click', function () {
    if (hiddenmap == 1) {
      setTimeout(function () {
        document.getElementsByClassName('js-map')[0].style.width = '100%';
      }, 200);

      hiddenmap = 0;
    } else {
      document.getElementsByClassName('js-map')[0].style.width = '0';
      hiddenmap = 1;
    }
  });
};

const listenToSelectors = function () {
  routeSelector.addEventListener('change', function () {
    getRoutesByDateRouteID(dateSelector.value);
  });
  dateSelector.addEventListener('change', function () {
    getRoutesByDate(dateSelector.value);
  });
};

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.log('DOM Loaded');

  routeSelector = document.querySelector('.js-route-selector');
  dateSelector = document.querySelector('.js-date-selector');

  distanceCard = document.querySelector('.js-label-routedistance');
  avgSpeedCard = document.querySelector('.js-label-routeaveragespeed');
  fuelusageCard = document.querySelector('.js-label-routetotalfuel');
  fuelRateCard = document.querySelector('.js-label-routeaveragefuel');
  costsCard = document.querySelector('.js-label-routecosts');

  listenToSelectors();
  showRoutesMap();
  listenToMenuIcon();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion
