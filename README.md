# YAHOO FANTASYSPORTS POC

This repo contains 4 parts (oauth cloud functions, datasource, oraclescript, cosmwasm_example_usage) that are used to find information from Yahoo fantasy sports using Band and then securely submit it to Terra via Band's bridge contract.

## OAuth Cloud Functions

```sh
virtualenv -p python3 venv
source venv/bin/activate
pip install -e .
pip install -r requirements.txt
```

## Data source

- Definition of the data source 👉 https://docs.bandchain.org/whitepaper/terminology.html.
- Currently deployed data source 👉 https://laozi-testnet2.cosmoscan.io/data-source/87.
- Curent implementation 👉 ["datasource"](datasource)

## Oracle script

- Definition of the oracle script 👉 https://docs.bandchain.org/whitepaper/terminology.html.
- Currently deployed oracle script 👉 https://laozi-testnet2.cosmoscan.io/oracle-script/50.
- Curent implementation 👉 ["oraclescript"](oraclescript)

## Cosmwasm Example Usage

This [folder](cosmwasm_example_usage) is composed of an example contract for sport data consumer and the oracle usage flow using `bandchain.js` and `terra.js`.
