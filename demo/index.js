const crypto = require('crypto');
const { TwoPartySigner, EcdsaParty2Share } = require('../packages/taquito-signer/dist/lib');
const { Tezos, DEFAULT_GAS_LIMIT } = require('../packages/taquito/dist/lib/taquito');
const { prefix, b58cencode } = require('../packages/taquito-utils/dist/lib/taquito-utils');
const BigNumber = require('bignumber.js');

const rpcUrl = {
  babylonnet: 'https://rpcalpha.tzbeta.net/',
  mainnet: 'https://mainnet.tezrpc.me'
};

async function getBalance(address, network) {
  Tezos.setProvider({
    rpc: rpcUrl[network]
  });
  try {
    return Tezos.tz.getBalance(address)
  } catch (e) {
    return new BigNumber(0);
  }
}

async function generateNewAccount() {
  Tezos.setProvider({
    signer: new TwoPartySigner()
  });
  const address = await Tezos.signer.publicKeyHash();
  const share = JSON.parse(await Tezos.signer.secretKey());
  return { share, address };
}

async function transfer(fromParty2Share, to, xtzAmount, network) {
  const party2Share = EcdsaParty2Share.fromPlain(fromParty2Share);
  Tezos.setProvider({
    signer: new TwoPartySigner({ party2Share }),
    rpc: rpcUrl[network]
  });
  const from = await Tezos.signer.publicKeyHash();
  try {
    // 1. get source balance
    const mutezBalance = await Tezos.tz.getBalance(from);
    const xtzBalance = Tezos.format('mutez', 'tz', mutezBalance);

    // 2. basic sanity (currently not including the fee)
    if (xtzBalance.lt(xtzAmount)) {
      return console.error(`Not enough balance. Have: ${xtzBalance} XTZ. Requested to transfer: ${xtzAmount}`);
    }

    // 3. get signature hash
    const forgedBytes = await Tezos.contract.getTransferSignatureHash({
      source: from,
      to,
      amount: xtzAmount
    });
    const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

    // 4. inject signature and broadcast
    return Tezos.contract.injectTransferSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
  } catch (err) {
    console.error('err =', err);
  }
}

async function transferAll(fromParty2Share, to, network) {
  Tezos.setProvider({
    signer: new TwoPartySigner({ party2Share: EcdsaParty2Share.fromPlain(fromParty2Share) }),
    rpc: rpcUrl[network]
  });
  const from = await Tezos.signer.publicKeyHash();
  try {
    // 1. mock transfer in order to calculate fee
    const mockForgedBytes = await Tezos.contract.getTransferSignatureHash({
      source: from,
      to,
      amount: 1,
      mutez: true
    });

    // 2. calculate amount to transfer
    const totalFee = mockForgedBytes.opOb.contents.reduce((acc, currContent) => {
      return acc + parseInt(currContent.fee);
    }, 0) + 1;
    const storageLimit = mockForgedBytes.opOb.contents[mockForgedBytes.opOb.contents.length - 1].storage_limit * 1000;  // given in mtz
    const mutezBalance = await Tezos.rpc.getBalance(from);
    const mutezAmount = mutezBalance.minus(totalFee + storageLimit);

    // 3. get signature hash of actual transfer
    const forgedBytes = await Tezos.contract.getTransferSignatureHash({
      source: from,
      to,
      amount: mutezAmount,
      mutez: true
    });

    const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

    // 4. inject signature and broadcast
    return Tezos.contract.injectTransferSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
  } catch (err) {
    console.error('err =', err);
  }
}

async function delegate(fromParty2Share, to, network, trackingId) {
  Tezos.setProvider({
    signer: new TwoPartySigner({ party2Share: EcdsaParty2Share.fromPlain(fromParty2Share) }),
    rpc: rpcUrl[network]
  });
  try {
    const source = await Tezos.signer.publicKeyHash();
    const delegateParams = { source, delegate: to };
    if (trackingId) {
      delegateParams.gasLimit = Math.ceil(DEFAULT_GAS_LIMIT.DELEGATION / 1000) * 1000 + parseInt(trackingId);
    }

    const forgedBytes = await Tezos.contract.getDelegateSignatureHash(delegateParams);
    const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    return Tezos.contract.injectDelegateSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
  } catch (err) {
    console.error('err =', err);
  }
}

module.exports = { delegate, generateNewAccount, getBalance, transfer, transferAll };
