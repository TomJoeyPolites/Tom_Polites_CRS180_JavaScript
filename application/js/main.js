//* https://old.coindesk.com/coindesk-api
//?FIRST DATE AVAILABLE 2010-07-17
//!LAST RECORDED DATE IN API REQUEST 2022-07-10

//* current date

let d = new Date();
let yr = d.getFullYear()
let mt = d.getMonth() + 1
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
//! USD 
//? https://api.coindesk.com/v1/bpi/historical/close.json
//? https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2013-09-05

async function bitCoinHist() {
  const bitcoin = await fetch(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-17&end=${nd}`
    //!LAST RECORDED DATE IN API REQUEST 2022-07-10
  );
  let result = await bitcoin.json();
  value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
  date = await Object.keys(result.bpi).map((key) => key);
  return { value, date };
}

bitCoinHist();

// https://www.chartjs.org/docs/latest/getting-started/
async function chartHistory() {
  let ctx = document.getElementById("history").getContext("2d");
  // const globalTemps = await getData();
  const coin = await bitCoinHist();
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
chartHistory();

//* BitCoin price in World Currencies: https://api.coindesk.com/v1/bpi/currentprice/<CODE>.json
//! FIX LOADING ISSUES => Add Promises? 
// TODO: Make into Table (?) / Research Bootstrap table components 
// TODO: Add symbol if available

async function displayCurrencies() {
  try {
    const data = await JSON.parse(currencies);
    // for (let i = 0; i < data.length; i++)
    for (let i = 0; i < 5; i++) {
      let country = data[i].currency
      let rate = await countryPrice(country)
      loadNewRow(i, rate, data)
    }
  } catch (error) {
    console.log(error)
  }
}

async function countryPrice(country) {
  let data = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${country}.json`)
  let result = await data.json();
  let rate = await result.bpi[country].rate

  //? Removes commas from string
  for (let j = 0; j < 5; j++) {
    rate = rate.replace(',', '')
  }
  //? Convert string to Num   
  rate = parseFloat(rate)

  //? Convert Num back to string rounded up to 2 decimal places 
  rate = rate.toFixed(2)

  return rate
}

function loadNewRow(i, rate, data) {
  let newRow = document.createElement('ul');
  newRow.id = `row${i}`;
  newRow.className = "list-group list-group-horizontal-md";
  currList.appendChild(newRow)

  let newCol1 = document.createElement('li');
  newCol1.id = `col${i}.1`;
  //? Col1 Class Style for Odd/Even 
  if (i % 2 == 0) {
    newCol1.className = "list-group-item list-group-item-primary";
  } else {
    newCol1.className = "list-group-item list-group-item-light"
  }
  let newCol1Text = document.createTextNode(data[i].currency)
  newCol1.appendChild(newCol1Text)
  newRow.appendChild(newCol1)

  // Create col2
  let newCol2 = document.createElement('li');
  newCol2.id = `col${i}.2`;

  //? Col2 Class Style for Odd/Even 
  if (i % 2 == 0) {
    newCol2.className = "list-group-item list-group-item-primary";
  } else {
    newCol2.className = "list-group-item list-group-item-light"
  }

  let newCol2Text = document.createTextNode(data[i].country)
  newCol2.appendChild(newCol2Text)
  newRow.appendChild(newCol2)

  // Create col3
  let newCol3 = document.createElement('li');
  newCol3.id = `col${i}.3`;

  //? Col3 Class Style for Odd/Even 
  if (i % 2 == 0) {
    newCol3.className = "list-group-item list-group-item-primary";
  } else {
    newCol3.className = "list-group-item list-group-item-light"
  }
  newCol3Text = document.createTextNode(rate)
  newCol3.appendChild(newCol3Text)
  newRow.appendChild(newCol3)
}

displayCurrencies()


//* User Specified Date Range
// TODO: * User input of required dates using similar code to above/below
// TODO 1 Collect Start & To Dates from form/input
// TODO 2 Put data into spec formatted Dates = startD / toD
// TODO 3 place startD & toD into url below `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startD}&end=${toD}`
// TODO 4 Run as graph

//* Current Price: https://api.coindesk.com/v1/bpi/currentprice.json
// TODO: Put in Table?
// TODO: Add AUD?

async function currentPrice() {
  try {
    const result = await getCurrentPrice();
    const currUS = await result.bpi.USD
    await loadCurrentPrice(currUS)
    const currGB = await result.bpi.GBP
    await loadCurrentPrice(currGB)
    const currEU = await result.bpi.EUR
    await loadCurrentPrice(currEU)
  } catch (error) {
      console.log(error)
  }
}

async function getCurrentPrice() {
  let data = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
  let result = await data.json();
  return result
}

function loadCurrentPrice(i){
  let newP = document.createElement('p')
  // TODO:  newP.className =
  newP.id = `${i.code}`
  
  //? Creates usable symbol in hex 
  switch(i.code) {
    case 'USD':
      i.symbol = '\u{24}'
      break;
    
    case 'GBP':
      i.symbol = '\u{00a3}'
      break;  
    
    case 'EUR':
      i.symbol = '\u{20ac}' 
      break;
  }
  var newPText = document.createTextNode(`${i.description}: ${i.symbol}${i.rate}`)
  newP.appendChild(newPText)
  currPriceList.appendChild(newP)
 }

currentPrice()

//* Compare buy price with current (loss or gain)



//* Compare buy price with sell date price



//* But you didn't GIF or YT VID
//? https://tenor.com/view/vine-funny-but-you-didnt-gif-15094926