# Cosmwasm example usage

## Data source and Oracle script on Band (band-laozi-testnet2)

| Type          | ID  | Link                                                 |
| ------------- | --- | ---------------------------------------------------- |
| Data source   | 87  | https://laozi-testnet2.cosmoscan.io/data-source/87   |
| Oracle script | 50  | https://laozi-testnet2.cosmoscan.io/oracle-script/50 |

## Contract addresses on Terra (tequila-0004)

| Name              | Address                                      | Description                                                                                                 |
| ----------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Consumer contract | terra1d3zsjh8r9679k2vd8arpl7acg36lg5xz94e4d5 | An example contract that consume data fron Bridge Contract. [See implementation](simple_sportdata_consumer) |
| Bridge Contract   | terra1h49znmw0j9aj3fgll7kdlt4zmwvr95mwfaagfa | [See doc](https://docs.bandchain.org/whitepaper/lite-client-protocol.html)                                  |

## Simple Sportdata Consumer

### Contract Handle Messages

### `TransferOwnership`

Transfer the ownership of this contract by updating the _OWNER_ state.

```
{
  "transfer_ownership": {
    "new_owner": <HumanAddr string>
  }
}
```

### `SetBridge`

Set the address of the bridge contract for this consumer contract. Return error if the message sender is not the owner of this contract.

```
{
  "set_bridge": {
    "new_bridge": <HumanAddr string>
  }
}
```

### `SaveVerifiedResult`

Query the result of the provided request_id from the **bridge contract** and then save it to the latest result state inside this **consumer contract**

```
{
  "save_verified_result": {
    "request_id": <request-id>
  }
}
```

### Contract Query Messages

### `Owner`

Query for the current owner of the contract.

```
{
  "owner": {}
}
```

### `Bridge`

Query for the address of the current **bridge contract**.

```
{
  "bridge": {}
}
```

### `LatestSavedResult`

Get the latest result from calling the `HandleMsg::SaveVerifiedResult` msg.

```
{
  "latest_saved_result": {}
}
```

### `GetResult`

Directly query the provided data request result from the **bridge contract**.

```
{
  "get_result": {
    "request_id": <request-id>
  }
}
```

## JavaScript Example Interaction Code

Make sure that `node` is installed in the system and run following command inside the `/example_interaction_js` directory

```sh
node index.js
```

### Overview of the code

```
┌───────────────────────────────────────────────────────────────┐
│ Get the request id from BandChain by sending a MsgRequestData │
│     transaction and use it to obtain the proof and result     │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼───────────────────────────────┐
│   Relay the block proof and verify the oracle data proof by   │
│    broadcasting HandleMsgs to bridge and consumer contract    │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                │                                                                                                    
┌───────────────────────────────▼───────────────────────────────┐
│    Retrieve the verified result from the consumer contract    │
│               via QueryMsg::LatestSavedResult                 │
└───────────────────────────────────────────────────────────────┘
```
