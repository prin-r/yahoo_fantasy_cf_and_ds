const {
  LCDClient,
  MsgSend,
  MnemonicKey,
  AccAddress,
  MsgExecuteContract,
  StdFee,
} = require("@terra-money/terra.js");
const {
  encodeRelayCandidateBlockInput,
  encodeAppendSignatureInput,
  encodeVerifyAndSaveResultInput,
} = require("./utils.js");
const { example_proof } = require("./proof_example.js");
const axios = require("axios");
const { Client } = require("@bandprotocol/bandchain.js");

// terra constants
// const bridgeAddress = "terra13maft6djmruegn2lmw5jzk583mq9tze02eaycs";
const bridgeAddress = "terra1h49znmw0j9aj3fgll7kdlt4zmwvr95mwfaagfa";
const consumerAddress = "terra1d3zsjh8r9679k2vd8arpl7acg36lg5xz94e4d5";
const mnemonic =
  "xxx;

// band constants
const bandchain = new Client("https://laozi-testnet2.bandchain.org");

// gas limit
const GAS = 2_000_000;

// connect to tequila testnet
const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev",
  chainID: "tequila-0004",
});

const wallet = terra.wallet(new MnemonicKey({ mnemonic }));

const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

const relayAndVerify = async (proof) => {
  const encodedBlockHeader = encodeRelayCandidateBlockInput(proof);
  const encodedSigs = encodeAppendSignatureInput(proof);
  const encodeVerifyAndSaveResult = encodeVerifyAndSaveResultInput(proof);

  // create msgs
  const msg1 = new MsgExecuteContract(wallet.key.accAddress, bridgeAddress, {
    relay_candidate_block: { data: encodedBlockHeader },
  });
  const msg2 = new MsgExecuteContract(wallet.key.accAddress, bridgeAddress, {
    append_signature: { data: encodedSigs },
  });
  const msg3 = new MsgExecuteContract(wallet.key.accAddress, bridgeAddress, {
    verify_and_save_result: { data: encodeVerifyAndSaveResult },
  });

  // sign tx
  const signedTx = await wallet.createAndSignTx({
    msgs: [msg1, msg2, msg3],
    fee: new StdFee(GAS, { uluna: Math.ceil(GAS * 0.15) }),
  });

  // broadcast tx
  const { txhash } = await terra.tx.broadcastSync(signedTx);
  console.log("broadcast tx: ", txhash);

  const txResult = await validateTx(txhash);
  console.log("\n");
  if (!txResult) {
    throw "Fail to get result from chain";
  }
};

const requestDataAndGetProof = async () => {
  try {
    const mockRequestID = 309714;
    const {
      data: {
        result: { proof },
      },
    } = await axios.get(
      "https://laozi-testnet2.bandchain.org/oracle/proof/" + mockRequestID
    );
    return proof;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const validateTx = async (txhash) => {
  let height = 0;
  let max_retry = 30;
  while (max_retry > 0) {
    await sleep(1000);
    max_retry--;
    try {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write("polling: " + (30 - max_retry));
      const txInfo = await terra.tx.txInfo(txhash);
      return txInfo;
    } catch (err) {
      if (err.isAxiosError && err.response && err.response.status !== 404) {
        console.error(err.response.data);
      } else if (!err.isAxiosError) {
        console.error(err.message);
      }
    }
  }
  return null;
};

const getLatestSaveResultFromConsumer = async () => {
  try {
    const result = await terra.wasm.contractQuery(consumerAddress, {
      latest_saved_result: {},
    });
    return result;
  } catch (e) {
    console.log("Fail to get latest result from consumer contract");
    console.log(e);
  }
  return null;
};

(async () => {
  while (true) {
    try {
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      await relayAndVerify(example_proof);

      return;

      const result = await requestDataAndGetProof();
      console.log(result);

      const currentRates = await getLatestSaveResultFromConsumer();
      if (currentRates) {
        console.log("latest saved result: ", JSON.stringify(currentRates));
      } else {
        throw "Fail to get current rates from std contract";
      }

      // const relay = await getStockPrices();
      // if (relay) {
      //   console.log("\n relay message: ", JSON.stringify({ relay }));
      // } else {
      //   throw "Fail to get stock price from band";
      // }

      // // create msg
      // const execute = new MsgExecuteContract(
      //   wallet.key.accAddress,
      //   stdContractAddress,
      //   { relay }
      // );
      // // sign tx
      // const signedTx = await wallet.createAndSignTx({
      //   msgs: [execute],
      //   fee: new StdFee(GAS, { uluna: Math.ceil(GAS * 0.15) }),
      // });

      // // broadcast tx
      // const { txhash } = await terra.tx.broadcastSync(signedTx);
      // console.log("broadcast tx: ", txhash);

      // const txResult = await validateTx(txhash);
      // console.log("\n");
      // if (!txResult) {
      //   throw "Fail to get result from chain";
      // }

      // if (!txResult.code) {
      //   console.log("tx successfully send!");
      // } else {
      //   throw "Fail to send tx with result: " + JSON.stringify(txResult);
      // }
    } catch (e) {
      console.log(e);
    }
    console.log(
      "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    );
    await sleep(10000);
  }
})();
