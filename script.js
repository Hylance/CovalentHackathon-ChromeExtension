// Set your API key here
const APIKEY = 'onemillionwallets';

// Token table reset
const tableRef = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
tableRef.innerHTML = "";

// Covalent API request setup
const url = new URL(`https://api.covalenthq.com/v1/pricing/tickers/`);
url.search = new URLSearchParams({
    key: APIKEY,
    tickers: ["BTC", "WETH", "DAI", "YFI", "AAVE", "UNI"]
})

// Use Fetch API to get Covalent data and display in token table
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
    let tokens = data.data.items;
    return tokens.map(function(token) { // Map through the results and for each run the code below
    tableRef.insertRow().innerHTML = 
        `<td><img src=${token.logo_url} style=width:50px;height:50px;></td>` +
        `<td> ${token.contract_name} </td>` +
        `<td> ${token.contract_ticker_symbol} </td>` +
        `<td> $${parseFloat(token.quote_rate).toFixed(2)} </td>`
    })
})
