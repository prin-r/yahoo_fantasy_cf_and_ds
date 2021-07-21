# Std Reference Proxy

## Contract Address On Holodeck-2 Testnet

```
contract
secret1p0jtg47hhwuwgp4cjpc46m7qq6vyjhdsvy2nph

owner
secret17pqare3qzl94mpc9khntn22e94hhz4ajw290yu
```

### Build Wasm & Zip

```
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown --locked
cat ./target/wasm32-unknown-unknown/release/std_reference_proxy.wasm | gzip -9 > contract.wasm.gz
```

### Store Code

```
secretcli tx compute store ./contract.wasm.gz --from mumu -y --gas 2000000 --gas-prices=1.0uscrt
```

### Instantiate Contract From Stored Code

```
                can be retrived from store code tx
                                      |
                                      v
secretcli tx compute instantiate [code-id] "{\"init_ref_addr\":\"secret1yxyn4hepg5ge3jdwlxh0qzhwhw7c8lqth00kfc\", \"init_ref_hash\": \"72a2a86c2648aae1dbce96a373b261c29ab8a8da1cdfe07561d4a516dacd008d\"}" --from [sender] --label ["any string"] -y --keyring-backend test
```

### Example Tx (Please note that we are using mock values here)

Set Reference Base Contract Address And Code-Hash

```
secretcli tx compute execute secret1p0jtg47hhwuwgp4cjpc46m7qq6vyjhdsvy2nph "{\"set_ref\":{ \"new_ref_addr\":\"secret1yxyn4hepg5ge3jdwlxh0qzhwhw7c8lqth00kfc\" , \"new_ref_hash\":\"72a2a86c2648aae1dbce96a373b261c29ab8a8da1cdfe07561d4a516dacd008d\" }}" --from sneder --keyring-backend test
```

### Example Queries

Query `get_reference_data_bulk`

```
secretcli query compute query secret1p0jtg47hhwuwgp4cjpc46m7qq6vyjhdsvy2nph "{\"get_reference_data_bulk\":{\"base_symbols\":[\"GOOG\",\"BAND\"], \"quote_symbols\":[\"USD\", \"USD\"]}}"
```

Query Contract Hash

```
secretcli query compute contract-hash secret1p0jtg47hhwuwgp4cjpc46m7qq6vyjhdsvy2nph
```
