// Set your API key here
const APIKEY = 'onemillionwallets';

// Token table reset
const tableRef = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
tableRef.innerHTML = "";

//let initialTokens = ["BTC", "WETH"];
//localStorage.setItem('tokens', JSON.stringify(initialTokens));

// Covalent API request setup
const url = new URL(`https://api.covalenthq.com/v1/pricing/tickers/`);

document.getElementById("addButton").addEventListener("click", addNewToken);
document.getElementById("removeButton").addEventListener("click", removeOldToken);
document.getElementById("toggle").addEventListener("click", toggle);
document.getElementById("clear").addEventListener("click", clear);

// Use Fetch API to get Covalent data and display in token table
function getSpotPrices(url) {

    chrome.storage.sync.get('storedTokens', function(result) {
        if(result.storedTokens.length > 0) {
            url.search = new URLSearchParams({
                key: APIKEY,
                tickers: result.storedTokens
            })
            fetchUrl(url)
        } else {
            showEmptyMessage();
        }
    })
}

function showEmptyMessage() {
    document.getElementById('tokenTable').classList.add("hidden");
    document.getElementById('empty-warning').innerText = "You don't have any saved tokens yet. \n Click on the toggle above to add a new token you like."
}

function clear() {
    chrome.storage.sync.set({'storedTokens': []}, function() {
        getSpotPrices(url)
    });
}

function fetchUrl(url) {
    fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            let tokens = data.data.items;
            tableRef.innerHTML = "";
            if (tokens.length > 0) {
                if (document.getElementById('tokenTable').classList.contains("hidden")) {
                    document.getElementById('tokenTable').classList.remove("hidden");
                    document.getElementById('empty-warning').innerText = "";
                }
                return tokens.map(function(token) { // Map through the results and for each run the code below
                    tableRef.insertRow().innerHTML =
                        `<td><img src=${token.logo_url} class="token-logo"></td>` +
                        `<td class="token"> ${token.contract_name} </td>` +
                        `<td class="token"> ${token.contract_ticker_symbol} </td>` +
                        `<td class="token"> $${parseFloat(token.quote_rate).toFixed(2)} </td>`
                })
            } else if (!document.getElementById('tokenTable').classList.contains("hidden")) {
                showEmptyMessage();
            }
        })
}

function addNewToken() {
    let newToken = document.getElementById("new-token").value.toUpperCase();
    document.getElementById("new-token").value = "";
    if(newToken === "WETH") {
        newToken = "ETH"
    } else if (newToken === "WBTC") {
        newToken = "BTC"
    }
    saveNewTokenToLocalStorage(newToken);
}

function removeOldToken() {
    let oldToken = document.getElementById("old-token").value.toUpperCase();
    if(oldToken === "WETH") {
        oldToken = "ETH"
    } else if (oldToken === "WBTC") {
        oldToken = "BTC"
    }
    document.getElementById("old-token").value = "";
    removeOldTokenFromLocalStorage(oldToken);
}

function toggle() {
    const element = document.getElementById("moreToken");
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function saveNewTokenToLocalStorage(newToken) {
    //let tokens = [];
    // Parse the serialized data back into an aray of objects
    //tokens = JSON.parse(localStorage.getItem('tokens')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    //tokens.push(newToken);
    // Re-serialize the array back into a string and store it in localStorage
    //localStorage.setItem('tokens', JSON.stringify(tokens));
    chrome.storage.sync.get('storedTokens', function(result) {
        let storedTokens = result.storedTokens || [];
        storedTokens.push(newToken);
        chrome.storage.sync.set({'storedTokens': storedTokens}, function() {
            getSpotPrices(url)
        });
    });
}

function removeOldTokenFromLocalStorage(oldToken) {
    //let tokens = [];
    // Parse the serialized data back into an aray of objects
    //tokens = JSON.parse(localStorage.getItem('tokens')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    chrome.storage.sync.get('storedTokens', function(result) {
        let storedTokens = result.storedTokens || [];
        const index = storedTokens.indexOf(oldToken);
        if (index > -1) {
            storedTokens.splice(index, 1);
        }
        chrome.storage.sync.set({'storedTokens': storedTokens}, function() {
            getSpotPrices(url)
        });
    });
    // Re-serialize the array back into a string and store it in localStorage
    //localStorage.setItem('tokens', JSON.stringify(tokens));
}

//Update the spot price every 10 seconds which is also the refresh rate of Covalent API
getSpotPrices(url);
setInterval(() => getSpotPrices(url), 10*1000);
