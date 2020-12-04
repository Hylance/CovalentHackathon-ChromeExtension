// Set your API key here
const APIKEY = 'onemillionwallets';

// Token table reset
const tableRef = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
tableRef.innerHTML = "";

// Covalent API request setup
const url = new URL(`https://api.covalenthq.com/v1/pricing/tickers/`);
url.search = new URLSearchParams({
    key: APIKEY,
    tickers: ["BTC", "WETH", "DOT", "YFI", "AAVE"]
})

// Use Fetch API to get Covalent data and display in token table
function getSpotPrices(url) {
    fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            let tokens = data.data.items;
            tableRef.innerHTML = "";
            return tokens.map(function(token) { // Map through the results and for each run the code below
                tableRef.insertRow().innerHTML =
                    `<td><img src=${token.logo_url} class="token-logo"></td>` +
                    `<td class="token"> ${token.contract_name} </td>` +
                    `<td class="token"> ${token.contract_ticker_symbol} </td>` +
                    `<td class="token"> $${parseFloat(token.quote_rate).toFixed(2)} </td>`
            })
        })
}

//Update the spot price every 30 seconds which is also the refresh rate of Covalent API
getSpotPrices(url);
setInterval(() => getSpotPrices(url), 30*1000);
