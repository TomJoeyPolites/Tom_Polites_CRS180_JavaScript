//*Const Data, Arrays & DOM
//! codesCurrentPrice may need to move to json file.

//? Arrays:
const resultCurrentPrice = new Array();
const resultWorldCurrencies = new Array();
const coin = new Array();


//? Data:
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

// Current Prices
for (let i = 0; i < codesCurrentPrice.length; i++){
  let c = codesCurrentPrice[i]
  fetch(`https://api.coindesk.com/v1/bpi/currentprice/${c}.json`)
  .then(response => response.json())
  .then(data => {
    resultCurrentPrice.push(data.bpi[c])
  })
  .catch(error => console.log('ERROR', error))
}
console.log('Current Prices loaded!')

// World Currencies
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
console.log('World Currencies loaded!')

//Chart
// Current date
let d = new Date();
let yr = d.getFullYear()
let mt = d.getMonth() + 1
mt = mt < 10 ? "0" + mt : mt
let dy = d.getDate()
dy = dy < 10 ? "0" + dy : dy
let endDate = `${yr}-${mt}-${dy}`.toString()

// Prev Year
startDate = `${yr-1}-${mt}-${dy}`.toString()


// chartHistory();
async function chartHistory() {
  let ctx = document.getElementById("history").getContext("2d");
  
  const coin = await fetchChartHistory();
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
  console.log('History Chart loaded!')
}

async function fetchChartHistory(){
  const bitcoin = await fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`);
    //!LAST RECORDED DATE IN API REQUEST 2022-07-10
  let result = await bitcoin.json();
  value = await Object.keys(result.bpi).map((key) => result.bpi[key]);
  date = await Object.keys(result.bpi).map((key) => key);
  return { value, date };
}
chartHistory()

//* Search World Currencies
const search = document.getElementById('search');

const matchList = document.getElementById('match-list');

const pinList = document.getElementById('pinList');

const pinnedList = new Array();

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
  
  // Clears search
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

//Show results in HTML
const outputHTML = matches => {
  if(matches.length > 0) {
    let html = matches.map(match => 
      `
      <div class="row ms-3 mt-3 border-bottom">
        <div class="col-xs col-sm-11 col-md-11 pt-2">
          <h5>${match.country} (${match.currency}) : <span class="text-success">${match.rate} </span>
        </div>
        <div class="col-xs col-sm-1 col-md-1">
          <button type="button" class="btn btn-warning btn-sm" id="${match.currency}_pin">Pin</button>
        </div>
      </div>
      `).join("");
    console.log(html)

    matchList.innerHTML = html;
    
    }
    
}

const pinHTML = m => {
  let html = 
    `<div class="row ms-3 mt-3 border-bottom">
    <div class="col-xs col-sm-11 col-md-11 pt-2">
    <h5>${m.country} (${m.currency}) : <span class="text-success">${m.rate} </span>
    </div>
    <div class="col-xs col-sm-1 col-md-1">
    <button type="button" class="btn btn-danger btn-sm" id="${m.currency}_del">Remove</button>
    </div>
    </div>
    `
    console.log(html)
  pinnedList.unshift(html) 
  for (let i = 1; i < pinnedList.length; i++) {
    let j = 0
    if (pinnedList[i] == pinnedList[j]){
      console.log('removing previous iteration')
      pinnedList.splice(j, 1);
    }
  }
  console.log(pinnedList) 
  newDiv = document.createElement('div')
  newDiv.innerHTML = pinnedList[0]
  pinList.appendChild(newDiv);


}

// const outputPinList = matches =>

search.addEventListener('input', () => searchCurrencies(search.value))


