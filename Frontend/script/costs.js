//#region ***  DOM references                           ***********
const hostIP = `http://${window.location.hostname}:5000`;

let costsRouteCard = '';
let costsKmCard = '';
let costsFuelCard = '';
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
showCostsData = function (jsonObject) {
  costsRouteCard.innerHTML = '€' + Math.round(jsonObject['avgCostsRoute'] * 100) / 100;
  costsKmCard.innerHTML = '€' + Math.round(jsonObject['avgCostsKM'] * 100) / 100;
  costsFuelCard.innerHTML = '€' + Math.round(jsonObject['avgCostsFuelprice'] * 100) / 100;
};
//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********

//#endregion

//#region ***  Data Access - get___                     ***********
const getFuelChartsWeekly = function () {
  handleData(`${hostIP}/api/data/costs`, showCostsData);
};
//#endregion

//#region ***  Event Listeners - listenTo___            ***********
//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  costsRouteCard = document.querySelector('.js-label-averagecostroute');
  costsKmCard = document.querySelector('.js-label-averagecostkm');
  costsFuelCard = document.querySelector('.js-label-averagecostday');

  getFuelChartsWeekly();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion
