//? current date
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

const cd = `${yr}-${mt}-${dy}`.toString()
// Prev Year
const ld = `${yr-1}-${mt}-${dy}`.toString()

//?'CODE' Reference Array for fetchCurrentPrice()
const codesCurrentPrice = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'HKD',
  'NZD',
]

//? Data Array for S1 Current Prices
const resultCurrentPrice = new Array();

//? Data Array for S3 List 
const resultWorldCurrencies = new Array();

// TODO: CREATE LOADING OVERLAY

// TODO: CREATE Error OVERLAY

//! WILL NEED TO RUN ALL FETCH BPI functions FIRST to allow loading: 
//! - fetchCurrentPrice
//? May be better to load BPI when needed
//! - loadWorldCurrencies 
//!   -> fetchBPIWorldCurrencies
//! - 

async function onLoad(){
  try {
    //* Fetch current BPI from API 
    await currentPrice()

    //* Load BPI into Section 1
    for (let i = 0; i < resultCurrentPrice.length; i++){
      await loadCurrentPrice(i)
    }
    
    //* Load & Fetch Graph
    await chartHistory();

    //* Fetch list of currencies
    await fetchWorldCurrencies()

    //* Load list fo currencies
    await worldCurrencies()
    
  }
  catch(error) {
    console.log(error)
  }
}

async function currentPrice() {
  try {
    console.log(`Fetching Current Price...`)
    for (let i = 0; i < codesCurrentPrice.length; i++) {
      let c = codesCurrentPrice[i];
      const result = await fetchCurrentPrice(c);
      await resultCurrentPrice.push(result.bpi[c])
    }
    return resultCurrentPrice
  } catch (error) {
      console.log(error)
  }
}

async function fetchCurrentPrice(c) {
  let data = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${c}.json`)
  let result = await data.json();
  return result
}

function loadCurrentPrice(i) {
  console.log('Loading HTML of Current Price...')
  let c = resultCurrentPrice[i]
  let newDiv = document.getElementById(`${c.code}_div`)
  let newPrice = document.getElementById(`${c.code}_span`)
  newDiv.innerHTML = `${c.description}`
  rate = c.rate_float
  rate = rate.toFixed(2)
  newPrice.innerHTML = `$ ${rate}`
}

// TODO: calcDate()
async function chartHistory() {
  let ctx = document.getElementById("history").getContext("2d");
  
  const coin = await fetchChartHistory();
  console.log('Loading Chart...')
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      // labels: globalTemps.years,
      labels: coin.date,
      datasets: [
        {
          label: "BitCoin Value",
          backgroundColor: "rgb(13, 110, 253)",
          borderColor: "rgb(13, 110, 253)",
          data: coin.value,
        },
      ],
    },

    // Config options go here
    options: {},
  });

  let dateSearch = document.getElementById('dateSearch')

  dateSearch.addEventListener('click', searchHistory)
}

async function fetchChartHistory(){
  console.log('Fetching Chart...')
  const bitcoin = await fetch(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=${ld}&end=${cd}`
    //!LAST RECORDED DATE IN API REQUEST 2022-07-10
  );
  let result = await bitcoin.json();
  value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
  date = await Object.keys(result.bpi).map((key) => key);
  return { value, date };
}


async function fetchWorldCurrencies() {
  try {
    console.log('Fetching World Currencies...')
    const data = JSON.parse(currencies)
    for (let i = 0; i < data.length; i++) {
      resultWorldCurrencies.push(data[i])
    }
    // for (let i = 0; i < resultWorldCurrencies.length; i++)
    for (let i = 0; i < 5; i++) 
    {
    await loadWorldCurrenciesBPI(i)
    //!  for (let i = 0; i < resultWorldCurrencies.length; i++)
    //! loadWorldCurrenciesBPI(i)
    }
  }
  catch(error) {
    console.log(error)
  }
}

async function loadWorldCurrenciesBPI(i){
  try {
    console.log('Fetching BPI of World Currencies...')

    //! Test 'pre-loading' BPI into array
    //? Load BPI as requested (save time)

    let c = resultWorldCurrencies[i].currency
    resultWorldCurrencies[i].rate = await fetchWorldCurrenciesBPI(c)
  } catch (error) {
    console.log(error)
  }
}

async function fetchWorldCurrenciesBPI(c) {
  let data = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${c}.json`)
  let result = await data.json();
  let rate = result.bpi[c].rate_float
  rate = rate.toFixed(2);
  return rate
}

async function worldCurrencies(){
  try {
      
    // loadWorldCurrenciesSearch()
      // - Case of list (in sep array?)
      // - Code & CurrencyName
    await loadWorldCurrenciesList()
         
  } catch (error) {
      console.log(error)
  }
 
}

async function loadWorldCurrenciesList(){
  try {
  // TODO: if: button value = ? then j < ? 
  // TODO: else:  j < 5
    console.log('Loading HTML of World Currencies List...')
    let i = 0;

    //? Create first Row for List
    let newTR = document.getElementById(`row_0`);
    body_worldCurrencies.appendChild(newTR)

    //? Create first Code
    let newCode = document.getElementById('WC_currency')    
    newCode.innerHTML = `${resultWorldCurrencies[i].currency}`
    newTR.appendChild(newCode)

    //? Create first Currency Name 
    let newCurrencyName = document.getElementById('WC_country')    
    newCurrencyName.innerHTML = `${resultWorldCurrencies[i].country}`
    newTR.appendChild(newCurrencyName)
    
    //? Create first BPI
    let newBpi = document.getElementById('WC_bpi')
    newBpi.innerHTML = `$${resultWorldCurrencies[i].rate}`
    newTR.appendChild(newBpi)

    //? Complete List
    
    // for (let i = 1; i < resultWorldCurrencies.length; i++) 
    for (let i = 1; i < 5; i++) {
      //? Create new Row
      let newTR = document.createElement('tr')
      newTR.id = `row_${i}`
      body_worldCurrencies.appendChild(newTR)

      //? Create new Code
      let newCode = document.createElement('th')
      newCode.id = `${i}_WC_currency`    
      newCode.innerHTML = `${resultWorldCurrencies[i].currency}`
      newTR.appendChild(newCode)  
      
      //? Create new Currency Name
      let newCurrencyName = document.createElement('td')
      newCurrencyName.id = `${i}_WC_currency`    
      newCurrencyName.innerHTML = `${resultWorldCurrencies[i].country}`
      newTR.appendChild(newCurrencyName)

      //? Create new BPI
      let newBpi = document.createElement('td')
      newBpi.id = `${i}_WC_currency`    
      newBpi.innerHTML = `$${resultWorldCurrencies[i].rate}`
      newTR.appendChild(newBpi)
      }
  } 
  catch (error) {
  console.log(error)
  }
}

onLoad()

// let dateSearch = document.getElementById('dateSearch')

// dateSearch.addEventListener('click', searchHistory)

async function searchHistory(){
  console.log('History Search button clicked!')
  

  let startDate = document.getElementById('startDate').value
  console.log(typeof startDate)
  console.log(startDate)
  let endDate = document.getElementById('endDate').value
  console.log(typeof endDate)
  console.log(endDate)
  
  chart.destroy()

   

  let ctx = document.getElementById("history").getContext("2d");

  const coin = await fetchHistorySearch(startDate, endDate);

  console.log(coin.date)
  console.log(coin.value)

  console.log('Loading Chart...')
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: coin.date,
      datasets: [
        {
          label: "BitCoin Value",
          backgroundColor: "rgb(13, 110, 253)",
          borderColor: "rgb(13, 110, 253)",
          data: coin.value,
        },
      ],
    },

    // Config options go here
    options: {},
  });

}

async function fetchHistorySearch(startDate, endDate){
  try{
    console.log('Fetching Chart...')
    console.log(startDate)
    console.log(endDate)
    const bitcoin = await fetch(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`);

    let result = await bitcoin.json();
    value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
    date = await Object.keys(result.bpi).map((key) => key);

    return { value, date };

  }
  catch (error) {
    console.log(error)
    }
}

