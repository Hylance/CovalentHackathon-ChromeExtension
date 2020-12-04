// Set your API key here
const APIKEY = 'onemillionwallets';

// Token table reset
const tableRef = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
tableRef.innerHTML = "";

let initialTokens = ["BTC", "WETH", "AAVE", "YFI", "SNX"];
localStorage.setItem('tokens', JSON.stringify(initialTokens));

// Covalent API request setup
const url = new URL(`https://api.covalenthq.com/v1/pricing/tickers/`);

document.getElementById("addButton").addEventListener("click", addNewToken);
document.getElementById("removeButton").addEventListener("click", removeOldToken);

// Use Fetch API to get Covalent data and display in token table
function getSpotPrices(url) {
    url.search = new URLSearchParams({
        key: APIKEY,
        tickers: JSON.parse(localStorage.getItem('tokens'))
    })
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

function addNewToken() {
    const newToken = document.getElementById("new-token").value;
    document.getElementById("new-token").value = "";
    saveNewTokenToLocalStorage(newToken.toUpperCase());
    getSpotPrices(url);
}

function removeOldToken() {
    const oldToken = document.getElementById("old-token").value;
    document.getElementById("old-token").value = "";
    removeOldTokenFromLocalStorage(oldToken.toUpperCase());
    getSpotPrices(url);
}

function saveNewTokenToLocalStorage(newToken) {
    let tokens = [];
    // Parse the serialized data back into an aray of objects
    tokens = JSON.parse(localStorage.getItem('tokens')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    tokens.push(newToken);
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('tokens', JSON.stringify(tokens));
}

function removeOldTokenFromLocalStorage(oldToken) {
    let tokens = [];
    // Parse the serialized data back into an aray of objects
    tokens = JSON.parse(localStorage.getItem('tokens')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    const index = tokens.indexOf(oldToken);
    if (index > -1) {
        tokens.splice(index, 1);
    }
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('tokens', JSON.stringify(tokens));
}

//Update the spot price every 30 seconds which is also the refresh rate of Covalent API
getSpotPrices(url);
setInterval(() => getSpotPrices(url), 30*1000);
