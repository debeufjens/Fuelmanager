const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

let kphCard = '';
let rpmCard = '';
let fuelCard = '';
let coolantCard = '';

const listenToSocket = function () {
  socket.on('connected', function () {
    console.log('connected with backend');
  });

  socket.on('dataUpdate', function (jsonObject) {
    kphCard.innerHTML = String(Math.round(jsonObject['kph'] * 10) / 10) + ' km/h';
    rpmCard.innerHTML = String(Math.round(jsonObject['rpm'] * 10) / 10) + ' RPM';
    fuelCard.innerHTML = String(Math.round(jsonObject['maf'] * 100) / 100) + ' g/s';
    coolantCard.innerHTML = String(Math.round(jsonObject['coolant'])) + ' °C';
  });
};

document.addEventListener('DOMContentLoaded', function () {
  kphCard = document.querySelector('.js-label-kph');
  rpmCard = document.querySelector('.js-label-rpm');
  fuelCard = document.querySelector('.js-label-fuelusage');
  coolantCard = document.querySelector('.js-label-coolant');

  listenToSocket();
});
