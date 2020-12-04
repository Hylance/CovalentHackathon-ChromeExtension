# Spot Prices Chrome Extension

To get started, just hit the `Run` button! You will see a preview of a live webpage pulling in the spot prices for a list of ERC20 tokens. 

To learn how to use the provided code to setup a Chrome extension, follow the tutorial below.  
&nbsp;
# Tutorial

In this tutorial, we will walk through the basics of using the **spot price** Covalent API endpoint:
```
GET /v1/pricing/tickers/
```
This basic endpoint gets spot prices and metadata for all, or a select group of, ERC20 standard tickers. Without passing the `tickers` query param, it returns a paginated list of ALL ERC20 tickers sorted by market cap.

We will use this endpoint to create a simple *Chrome extension* containing the spot prices for a select group of ERC20 tickers. 

The Covalent API docs can be found here: https://www.covalenthq.com/docs/api/
&nbsp;
## Covalent API setup
The Covalent APIs consist of four main endpoints types:

- indexed by wallet addresses
- indexed by token contract addresses
- indexed by networks
- generic event log calls

Key points to keep in mind:
- All requests are done over HTTPS (calls over plain HTTP will fail.)
- The current version of the API is version 1.
- The return format for all endpoints is JSON.
- All requests require authentication.

The main keys in the `json` response object are: `data`, `error`, `error_message` and `error_code`.

**Note: Please register for an API key from https://www.covalenthq.com/platform/**.

&nbsp;
## Using the Spot Prices API endpoint
```
GET /v1/pricing/tickers/
```

This basic endpoint gets spot prices and metadata for all, or a select group of, ERC20 standard tickers. It is a simple endpoint, yet rich with metadata that can be used when creating a wallet app.

Here is what the results look like in `json` format. 

```
{
  "data": {
     "items": [
       {
         "contract_decimals": 6,
         "contract_name": "Tether USD",
         "contract_ticker_symbol": "USDT",
         "contract_address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
         "logo_url": "https://logos.covalenthq.com/tokens/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
         "quote_rate": 0.9972122,
         "rank": 4
       },
       {...
```

So the `items` list contains all the ERC20 token data,sorted by market cap. 

&nbsp;
## Basic app using vanilla JavaScript
This app uses vanilla JavaScript and its native Fetch API to access spot price data via Covalent's APIs. All the heavy lifting is done in the file: `script.js`.

### `script.js`
First set the `APIKEY` variable with your key from https://www.covalenthq.com/platform/.

**Note:** We know that having your `APIKEY` displayed on the front-end of your app is not a good practice! The purpose here is to make it as *simple as possible* to start with a **shippable wallet prototype**, hosted on repl.it. In practice, you will want to have a web server back-end which handles all the API calls.  

The steps in this file are the following:
&nbsp;
1. Reset the token table:
```
const tableRef = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
tableRef.innerHTML = "";
```
&nbsp;
2. Formulate the URL and add a list of ticker symbols to fetch:
```
const url = new URL(`https://api.covalenthq.com/v1/pricing/tickers/`);
url.search = new URLSearchParams({
    key: APIKEY,
    tickers: ["WBTC", "DAI", "YFI", "AAVE", "UNI"]
})
```
&nbsp;
3. Use the Fetch and Covalent APIs to get and extract the spot price json data:
```
fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
```
&nbsp;
4. Go token by token and build the table data:
```
let tokens = data.data.items;
return tokens.map(function(token) { // Map through the results and for each run the code below
tableRef.insertRow().innerHTML = 
    `<td><img src=${token.logo_url} style=width:50px;height:50px;></td>` +
    `<td> ${token.contract_name} </td>` +
    `<td> ${token.contract_ticker_symbol} </td>` +
    `<td> $${parseFloat(token.quote_rate).toFixed(2)} </td>`
})
```

## Create a Chrome extension
Here are the steps to create a Chrome extension using this code template:

&nbsp;
1. Add an icon `.png` file to the project folder. For example, we have `omw_icon.png`. 
&nbsp;
2. Create a `manifest.json` file with the following contents:
```
{
  "manifest_version": 2,

  "name": "ERC20 Spot Prices",
  "description": "Display key ERC20 token spot prices",
  "version": "1.0",

  "browser_action": {
   "default_icon": "omw_icon.png",
   "default_popup": "index.html"
  },
  "permissions": [
   "activeTab"
   ]
}
```
Keep the `manifest_version: 2`, but feel free to update the other fields accordingly. 
&nbsp;
3. Then download the project folder as *Download as zip* and extract it on your local machine. 

![Download zip](https://mcusercontent.com/040e2f3f9d74f0f1ed3abc80a/images/de895ea1-eb05-4150-9c8d-7304c22253b0.png)
&nbsp;
4. Open up your Chrome browser and go to the URL: `chrome://extensions` which brings up the extensions page. 
&nbsp;
5. Check *Developer mode* to enable loading unpacked extensions. 

![Load extension](https://mcusercontent.com/040e2f3f9d74f0f1ed3abc80a/images/ce7e0f35-86e6-4033-a884-822a6a8517ca.png)
&nbsp;
6. Finally click *Load unpacked extension* and select your unzipped project folder.

Ensure your custom Chrome extension icon is active and visible in the browser toolbar. When you select it, you should see something similar to:

![Active chrome extension](https://mcusercontent.com/040e2f3f9d74f0f1ed3abc80a/images/909b766d-516f-4f44-820c-2007bb546cf4.png)

And that's it! Here is your opportunity to play with the response data and further build out your spot price Chrome extension! Some improvement ideas include:
* Ability to add/remove tokens from your list
* Auto refresh the table at a certain frequency
* Ability to see the spot price in different currencies using a dropdown selector
* Add some front-end 'pizzazz' by using a toolkit like Bootstrap (https://getbootstrap.com/)

### Support

If you have any questions regarding this code template, please message us on Discord: https://discord.gg/M4aRubV