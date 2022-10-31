//*Arrays
const resultCurrentPrice = new Array();
const resultWorldCurrencies = new Array();
const pinnedList = new Array();
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

//*HTML Elements
  //*Chart
    const dateSearch = document.getElementById('dateSearch') 
    let userStartDate = document.getElementById('startDate') 
    let userEndDate = document.getElementById('endDate')
  //*World Currencies
    const search = document.getElementById('search');
    const matchList = document.getElementById('match-list');
    const pinList = document.getElementById('pinList');

//*Current date calculation
let d = new Date();
let yr = d.getFullYear()
let mt = d.getMonth() + 1
mt = mt < 10 ? "0" + mt : mt
let dy = d.getDate()
dy = dy < 10 ? "0" + dy : dy
let endDate = `${yr}-${mt}-${dy}`.toString()

//? Prev Year
startDate = `${yr-1}-${mt}-${dy}`.toString()

//*Data on load 
window.addEventListener('load', (event) => {onLoad()})

const onLoad = async () => {
  try{
    for (let i = 0; i < codesCurrentPrice.length; i++) {
      await fetchCurrentPrice(codesCurrentPrice[i])
      //!setTimeout used to retrieve prices from API
      setTimeout(() => {
        loadCurrentPrice(i)
      }, 1250);
    }
    await chartHistory(); 

    await fetchWorldCurrencies()
    await console.log('All data retrieved from CoinDesk API successfully')
  } 
  catch(err){
    console.log(err)
  }
}

//*Loads Chart
async function chartHistory() {
  let ctx = document.getElementById("history").getContext("2d");
  
  let coin = await fetchChartHistory();
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      // labels: globalTemps.years,
      labels: coin.date,
      datasets: [
        {
          label: "BitCoin Value $USD",
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
//*Fetches data for Chart
async function fetchChartHistory(){
  const bitcoin = await fetch(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`
    //!LAST RECORDED DATE IN API REQUEST 2022-07-10
  );
  let result = await bitcoin.json();
  value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
  date = await Object.keys(result.bpi).map((key) => key);
  return { value, date };
}

//*Fetch BitCoin Prices
const fetchCurrentPrice = (id) => {
  fetch(`https://api.coindesk.com/v1/bpi/currentprice/${id}.json`)
  .then(response => response.json())
  .then(data => {
    resultCurrentPrice.push(data.bpi[id])
  })
  .catch(error => console.log('ERROR', error))
}

//*Load BitCoin Prices
const loadCurrentPrice = (i) => {
  let c = resultCurrentPrice[i]
  let newDiv = document.getElementById(`${c.code}_div`)
  let newPrice = document.getElementById(`${c.code}_span`)
  newDiv.innerHTML = `${c.description}`
  rate = c.rate_float
  rate = rate.toFixed(2)
  newPrice.innerHTML = `$ ${rate}`
}

//*Fetch search data
const fetchWorldCurrencies = () => {
  let data = JSON.parse(currencies)
  for (let i = 0; i < data.length; i++) {
    resultWorldCurrencies.push(data[i])
    let c = resultWorldCurrencies[i].currency
    fetch(`https://api.coindesk.com/v1/bpi/currentprice/${c}.json`)
    .then(response => response.json())
    .then(data => {
      rate = data.bpi[c].rate_float  
      rate = rate.toFixed(2);
      resultWorldCurrencies[i].rate = rate
    })
    .catch(error => console.log('ERROR', error))
  }
}
//*(END) Data on load

//*World Currencies - Search
const searchCurrencies = async searchText => {
  await resultWorldCurrencies
  // Get matches to input
    //?.filter() = Higher Order Array Method : return an array based off conditions
  let matches = resultWorldCurrencies.filter(world => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return world.currency.match(regex) || world.country.match(regex);
      //?Regular Expression 
      //RegExp(`^`) = Has to start with
      //RegExp(`gi`) = Flag for Lower/Upper
  })
  
  //? When Search is Clear
  if(searchText.length === 0) {
    matches = [];
    matchList.innerHTML = '';
  }

  outputHTML(matches);

  for (let i = 0; i < matches.length; i++) {
    let m = matches[i]
    let pin = document.getElementById(`${m.currency}_pin`)
    pin.addEventListener('click', () => pinHTML(m))
    }
};

//? Show results in HTML
const outputHTML = matches => {
  if(matches.length > 0) {
    let html = matches.map(match => 
      `
      <div class="row ms-3 me-3 mt-3 border-bottom">
        <div class="col-xs col-sm-9 col-md-9 pt-2">
          <h5>${match.country} (${match.currency}) : 
          </h5>
        </div>
        <div class="col-xs col-sm-2 col-md-2 text-success"><h5>${match.rate} </h5></div>
        <div class="col-xs col-sm-1 col-md-1">
          <button type="button" class="btn btn-warning btn-sm" id="${match.currency}_pin">Pin</button>
        </div>
      </div>
      `).join("");
    matchList.innerHTML = html;
    }
    
}

//? Creates HTML Pin
const pinHTML = m => {
  let html = 
    `<div class="row ms-3 me-3 border-bottom">
      <div class="col-xs col-sm-10 col-md-10 pt-2">
        <h5>${m.country} (${m.currency}) : <span class="text-success">${m.rate} </span>
        </h5>
      </div>
      
    </div>
    `
  pinnedList.push(html) 
  let c = pinnedList.length

  //? Checks for Multiples and removes newly created pin if found
  if (c > 1) {
    for (let i = 0; i < pinnedList.length -1 ; i++) {
      let j = pinnedList.length - 1
      if (pinnedList[i] == pinnedList[j]){
        pinnedList.splice(j, 1);
      }
    }
  }

  //? If no Multiples found then will add Pin
  if (c == pinnedList.length) {
    let p = pinnedList.length - 1
  newDiv = document.createElement('div')
  newDiv.id = `${m.currency}`
  newDiv.innerHTML = pinnedList[p]
  pinList.appendChild(newDiv);
  }

}

search.addEventListener('input', () => searchCurrencies(search.value))
//*(END) World Currencies - Search 

//*Chart - Search
const searchHistory = async (userSD, userED) => {
  let ctx = document.getElementById("history").getContext("2d");
  let coin = await fetchSearchHistory(userSD, userED);
  chart.destroy();
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

    options: {},
  });
}

async function fetchSearchHistory(userSD, userED){
  let data = await fetch(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=${userSD}&end=${userED}`
    //!LAST RECORDED DATE IN API REQUEST 2022-07-10
  );
  let result = await data.json();
  value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
  date = await Object.keys(result.bpi).map((key) => key);
  return { value, date };
}

dateSearch.addEventListener('click', () => searchHistory(userStartDate.value, userEndDate.value))
//*(END) Chart - Search