//* https://api.coindesk.com/v1/bpi/historical/close.json?
//?FIRST DATE AVAILABLE 2010-07-17
//!LAST RECORDED DATE IN API REQUEST 2022-07-10

//* current date

let d = new Date();
let yr = d.getFullYear() 
let mt = d.getMonth()+1
mt = mt < 10 ? "0" + mt : mt
// if (mt < 10){
//   mt = `0${mt}`
// }

let dy = d.getDate()
dy = dy < 10 ? "0" + dy : dy
// if (dy < 10){
//   dy = `0${dy}`
// }

const nd = `${yr}-${mt}-${dy}`.toString()

//* Chart of BitCoin Price first available date from CoinDesk 17/07/10 to current date

async function bitCoinHis() {
  const bitcoin = await fetch(
 `https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-17&end=${nd}`
//!LAST RECORDED DATE IN API REQUEST 2022-07-10
  );
  let result = await bitcoin.json();
  value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
  date = await Object.keys(result.bpi).map((key) => key);
  return { value, date };
}

bitCoinHis();

// https://www.chartjs.org/docs/latest/getting-started/
async function setup() {
  let ctx = document.getElementById("myChart").getContext("2d");
  // const globalTemps = await getData();
  const coin = await bitCoinHis();
  let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      // labels: globalTemps.years,
      labels: coin.date,
      datasets: [
        {
          label: "BitCoin Value",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: coin.value,
        },
      ],
    },

    // Config options go here
    options: {},
  });
}
setup();

//* User Specified Date Range
// TODO: * User input of required dates using similar code to above/below 
// TODO 1 Collect Start & To Dates from form/input
// TODO 2 Put data into spec formatted Dates = startD / toD 
// TODO 3 place startD & toD into url below `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startD}&end=${toD}`
// TODO 4 Run as graph

//* Current Price: https://api.coindesk.com/v1/bpi/currentprice.json



//* Converted Price in Currency: https://api.coindesk.com/v1/bpi/currentprice/<CODE>.json
//? List of currencies https://api.coindesk.com/v1/bpi/supported-currencies.json 



//* Compare buy price with current (loss or gain)



//* Compare buy price with sell date price 



//* But you didn't GIF or YT VID