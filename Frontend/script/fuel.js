//#region ***  DOM references                           ***********
const hostIP = `http://${window.location.hostname}:5000`;
let avgFuelLabel = '';
let totalFuelLabel = '';
let chartTotalFuel = '';
let chartAverageFuel = '';

const dailyCategories = ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'];
const weeklyCategories = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const monthlyCategories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
const yearlyCategories = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showAllCharts = function () {
  showInitChartTotalFuel();
  showInitChartAverageFuel();
};
const showInitChartTotalFuel = function () {
  var options = {
    series: [
      {
        name: 'Fuel Usage',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],

    chart: {
      id: 'chartTotalFuel',
      height: 265,
      type: 'area',
      fontFamily: "'Nunito Sans', Helvetica, arial, sans-serif",
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
    tooltip: {
      x: {},
    },
    title: {
      text: 'Fuel Usage',
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '20px',
        fontWeight: 700,
        fontFamily: 'Nunito Sans',
        color: '#000000',
      },
    },
  };

  chartTotalFuel = new ApexCharts(document.querySelector('.js-chart-totalfuel'), options);
  chartTotalFuel.render();
};

const showInitChartAverageFuel = function () {
  var options = {
    series: [
      {
        name: 'Average Fuel Usage',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],

    chart: {
      id: 'chartAverageFuel',
      height: 265,
      type: 'area',
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    },
    tooltip: {
      x: {},
    },
    title: {
      text: 'Average Fuel Usage',
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '20px',
        fontWeight: 700,
        fontFamily: 'Nunito Sans',
        color: '#000000',
      },
    },
  };

  chartAverageFuel = new ApexCharts(document.querySelector('.js-chart-averagefuel'), options);
  chartAverageFuel.render();
};

const showUpdateChart = function (chartname, series, categories) {
  ApexCharts.exec(
    chartname,
    'updateOptions',
    {
      xaxis: {
        categories: categories,
      },
    },
    false,
    true
  );

  ApexCharts.exec(
    chartname,
    'updateSeries',
    [
      {
        data: series,
      },
    ],
    true
  );
};

const showUpdateLabels = function (totalfuel, avgfuel) {
  document.querySelector('.js-label-totalfuel').innerHTML = totalfuel + ' L';
  document.querySelector('.js-label-averagefuel').innerHTML = avgfuel + ' L/100km';
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********
const callbackChartDataHandlerDaily = function (jsonObject) {
  let dailydataFuelUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let dailydataFuelRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let totalDailyFuelUsage = 0;
  let totalDailyFuelRate = 0;
  let numberOffDataEntries = 0;
  for (d of jsonObject) {
    dailydataFuelUsage[d['hourofday']] = Math.round(d['totalfuel'] * 100) / 100;
    dailydataFuelRate[d['hourofday']] = Math.round(d['avgfuel'] * 100) / 100;
    numberOffDataEntries++;
  }
  for (f of dailydataFuelUsage) {
    totalDailyFuelUsage += f;
  }
  totalDailyFuelUsage = Math.round(totalDailyFuelUsage * 100) / 100;
  for (f of dailydataFuelRate) {
    totalDailyFuelRate += f;
  }
  totalDailyFuelRate = Math.round((totalDailyFuelRate / numberOffDataEntries) * 100) / 100;

  showUpdateLabels(totalDailyFuelUsage, totalDailyFuelRate);
  showUpdateChart('chartTotalFuel', dailydataFuelUsage, dailyCategories);
  showUpdateChart('chartAverageFuel', dailydataFuelRate, dailyCategories);
};

const callbackChartDataHandlerWeekly = function (jsonObject) {
  let weeklydataFuelUsage = [0, 0, 0, 0, 0, 0, 0];
  let weeklydataFuelRate = [0, 0, 0, 0, 0, 0, 0];
  let totalWeeklyFuelUsage = 0;
  let totalWeeklyFuelRate = 0;
  let numberOffDataEntries = 0;
  for (d of jsonObject) {
    weeklydataFuelUsage[d['weekday']] = Math.round(d['totalfuel'] * 100) / 100;
    weeklydataFuelRate[d['weekday']] = Math.round(d['avgfuel'] * 100) / 100;
    numberOffDataEntries++;
  }
  for (f of weeklydataFuelUsage) {
    totalWeeklyFuelUsage += f;
  }
  totalWeeklyFuelUsage = Math.round(totalWeeklyFuelUsage * 100) / 100;
  for (f of weeklydataFuelRate) {
    totalWeeklyFuelRate += f;
  }
  totalWeeklyFuelRate = Math.round((totalWeeklyFuelRate / numberOffDataEntries) * 100) / 100;

  showUpdateLabels(totalWeeklyFuelUsage, totalWeeklyFuelRate);
  showUpdateChart('chartTotalFuel', weeklydataFuelUsage, weeklyCategories);
  showUpdateChart('chartAverageFuel', weeklydataFuelRate, weeklyCategories);
};

const callbackChartDataHandlerMonthly = function (jsonObject) {
  let monthlydataFuelUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let monthlydataFuelRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let totalMonthlyFuelUsage = 0;
  let totalMonthlyFuelRate = 0;
  let numberOffDataEntries = 0;
  for (d of jsonObject) {
    monthlydataFuelUsage[d['dayofmonth']] = Math.round(d['totalfuel'] * 100) / 100;
    monthlydataFuelRate[d['dayofmonth']] = Math.round(d['avgfuel'] * 100) / 100;
    numberOffDataEntries++;
  }
  for (f of monthlydataFuelUsage) {
    totalMonthlyFuelUsage += f;
  }
  totalMonthlyFuelUsage = Math.round(totalMonthlyFuelUsage * 100) / 100;
  for (f of monthlydataFuelRate) {
    totalMonthlyFuelRate += f;
  }
  totalMonthlyFuelRate = Math.round((totalMonthlyFuelRate / numberOffDataEntries) * 100) / 100;

  showUpdateLabels(totalMonthlyFuelUsage, totalMonthlyFuelRate);
  showUpdateChart('chartTotalFuel', monthlydataFuelUsage, monthlyCategories);
  showUpdateChart('chartAverageFuel', monthlydataFuelRate, monthlyCategories);
};

const callbackChartDataHandlerYearly = function (jsonObject) {
  let yearlydataFuelUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let yearlydataFuelRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let totalYearlyFuelUsage = 0;
  let totalYearlyFuelRate = 0;
  let numberOffDataEntries = 0;
  for (d of jsonObject) {
    yearlydataFuelUsage[d['monthofyear']] = Math.round(d['totalfuel'] * 100) / 100;
    yearlydataFuelRate[d['monthofyear']] = Math.round(d['avgfuel'] * 100) / 100;
    numberOffDataEntries++;
  }
  for (f of yearlydataFuelUsage) {
    totalYearlyFuelUsage += f;
  }
  totalYearlyFuelUsage = Math.round(totalYearlyFuelUsage * 100) / 100;
  for (f of yearlydataFuelRate) {
    totalYearlyFuelRate += f;
  }

  totalYearlyFuelRate = Math.round((totalYearlyFuelRate / numberOffDataEntries) * 100) / 100;
  showUpdateLabels(totalYearlyFuelUsage, totalYearlyFuelRate);
  showUpdateChart('chartTotalFuel', yearlydataFuelUsage, yearlyCategories);
  showUpdateChart('chartAverageFuel', yearlydataFuelRate, yearlyCategories);
};
//#endregion

//#region ***  Data Access - get___                     ***********
const getFuelChartsDaily = function () {
  handleData(`${hostIP}/api/data/charts/fuel/daily`, callbackChartDataHandlerDaily);
};

const getFuelChartsWeekly = function () {
  handleData(`${hostIP}/api/data/charts/fuel/weekly`, callbackChartDataHandlerWeekly);
};

const getFuelChartsMonthly = function () {
  handleData(`${hostIP}/api/data/charts/fuel/monthly`, callbackChartDataHandlerMonthly);
};

const getFuelChartsYearly = function () {
  handleData(`${hostIP}/api/data/charts/fuel/yearly`, callbackChartDataHandlerYearly);
};
//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToClickChartButtons = function () {
  const buttons = document.querySelectorAll('.js-chart-button');
  for (const btn of buttons) {
    btn.addEventListener('click', function () {
      const param = btn.getAttribute('data-selection');
      for (const btn of buttons) {
        btn.classList.remove('u-selected');
      }
      btn.classList.add('u-selected');

      switch (param) {
        case 'day':
          getFuelChartsDaily();
          break;
        case 'week':
          getFuelChartsWeekly();
          break;
        case 'month':
          getFuelChartsMonthly();
          break;
        case 'year':
          getFuelChartsYearly();
          break;
      }
    });
  }
};

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  totalFuelLabel = document.querySelector('.js-label-totalfuel');
  avgFuelLabel = document.querySelector('.js-label-averagefuel');

  listenToClickChartButtons();
  showAllCharts();
  getFuelChartsWeekly();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion
