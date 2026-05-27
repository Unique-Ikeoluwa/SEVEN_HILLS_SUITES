const { Wallet, verifyMessage, Mnemonic } = "ethers";
const db = require("../models");
const { Wallets } = db;


async function walletCreate() {
    const mnemonic = Mnemonic.fromEntropy(
    crypto.getRandomValues(new Uint8Array(16))
  );

  const wallet = Wallet.fromPhrase(mnemonic.phrase);

  return { wallet, mnemonic: mnemonic.phrase };


}

async function name(params) {
    
}