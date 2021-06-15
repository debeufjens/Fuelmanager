//#region ***  DOM references                           ***********
const hostIP = `http://${window.location.hostname}:5000`;

let brandInput = '';
let modelInput = '';
let enginesizeInput = '';
let kwInput = '';
let fueltypeInput = '';
let fuelpriceInput = '';

let brandValue = '';
let modelValue = '';
let enginesizeValue = '';
let kwValue = '';
let fueltypeValue = '';
let fuelpriceValue = '';

vehicleID = 1;
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showVehicleInfo = function (jsonObject) {
  brandInput.value = jsonObject['Brand'];
  modelInput.value = jsonObject['Model'];
  enginesizeInput.value = jsonObject['Engine_Size'];
  kwInput.value = jsonObject['KW'];
  fueltypeInput.value = jsonObject['Fuel_Type'];
  fuelpriceInput.value = jsonObject['Fuel_Cost'];
};
//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********
const callbackPutInputValues = function () {
  brandValue = brandInput.value;
  modelValue = modelInput.value;
  enginesizeValue = enginesizeInput.value;
  kwValue = kwInput.value;
  fueltypeValue = fueltypeInput.value;
  fuelpriceValue = fuelpriceInput.value;

  let jsonData = {
    vehicleID: vehicleID,
    Brand: brandValue,
    Model: modelValue,
    Engine_Size: enginesizeValue,
    KW: kwValue,
    Fuel_Type: fueltypeValue,
    Fuel_Cost: fuelpriceValue,
  };

  let jsonDateStringify = JSON.stringify(jsonData);
  console.log(jsonDateStringify);

  handleData(`http://127.0.0.1:5000/api/data/settings/${vehicleID}`, callbackUpdateReady, null, 'PUT', jsonDateStringify);
};

const callbackUpdateReady = function (data) {
  getVehicleInfo(vehicleID);
};
//#endregion

//#region ***  Data Access - get___                     ***********
const getVehicleInfo = function (vehicleID) {
  handleData(`${hostIP}/api/data/settings/${vehicleID}`, showVehicleInfo);
};
//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToInputFields = function () {
  const fields = document.querySelectorAll('.js-input');
  for (const field of fields) {
    field.addEventListener('change', function () {
      callbackPutInputValues();
    });
  }
};
//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  brandInput = document.querySelector('.js-input-brand');
  modelInput = document.querySelector('.js-input-model');
  enginesizeInput = document.querySelector('.js-input-enginesize');
  kwInput = document.querySelector('.js-input-kw');
  fueltypeInput = document.querySelector('.js-input-fueltype');
  fuelpriceInput = document.querySelector('.js-input-fuelprice');

  getVehicleInfo(vehicleID);
  listenToInputFields();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion
