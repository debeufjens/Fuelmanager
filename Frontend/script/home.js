//#region ***  DOM references                           ***********
const hostIP = `http://${window.location.hostname}:5000`;
let totalFuelCard = '';
let totalDistanceCard = '';
let totalRuntimeCard = '';
let totalAverageSpeedCard = '';
let totalCostsCard = '';
//#endregion 

//#region ***  Callback-Visualisation - show___         ***********
const showTotalFuelCard = function (jsonObject) {
  totalFuelCard.innerHTML = String(Math.round(jsonObject['totalfuel'] * 100) / 100) + ' L';
};

const showTotalDistanceCard = function (jsonObject) {
  totalDistanceCard.innerHTML = String(Math.round(jsonObject['totaldistance'] * 100) / 100) + ' km';
};

const showTotalRuntimeCard = function (jsonObject) {
  totalRuntimeCard.innerHTML = String(jsonObject['totalruntime']);
};

const showTotalAverageSpeedCard = function (jsonObject) {
  totalAverageSpeedCard.innerHTML = String(Math.round(jsonObject['avgavgspeed'] * 100) / 100) + ' km/h';
};

const showTotalCostsCard = function (jsonObject) {
  totalCostsCard.innerHTML = '€' + String(Math.round(jsonObject['totalcost'] * 100) / 100);
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********
//#endregion

//#region ***  Data Access - get___                     ***********
const getTotalFuel = function () {
  handleData(`${hostIP}/api/data/totalfuel`, showTotalFuelCard);
};

const getTotalDistance = function () {
  handleData(`${hostIP}/api/data/totaldistance`, showTotalDistanceCard);
};

const getTotalRuntime = function () {
  handleData(`${hostIP}/api/data/totalruntime`, showTotalRuntimeCard);
};

const getTotalAverageSpeed = function () {
  handleData(`${hostIP}/api/data/avgavgspeed`, showTotalAverageSpeedCard);
};

const getTotalCosts = function () {
  handleData(`${hostIP}/api/data/totalcost`, showTotalCostsCard);
};
//#endregion

//#region ***  Event Listeners - listenTo___            ***********

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  totalFuelCard = document.querySelector('.js-totalfuelusage');
  totalDistanceCard = document.querySelector('.js-totaldistance');
  totalRuntimeCard = document.querySelector('.js-totalruntime');
  totalAverageSpeedCard = document.querySelector('.js-totalaveragespeed');
  totalCostsCard = document.querySelector('.js-totalcosts');

  getTotalFuel();
  getTotalDistance();
  getTotalRuntime();
  getTotalAverageSpeed();
  getTotalCosts();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion
