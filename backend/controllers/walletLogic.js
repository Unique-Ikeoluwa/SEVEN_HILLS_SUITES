const { Wallet, verifyMessage, Mnemonic } = "ethers";
const db = require("../models");
const { Wallets } = db;


async function walletGen() {
    const mnemonic = Mnemonic.fromEntropy(
    crypto.getRandomValues(new Uint8Array(16))
  );

  const wallet = Wallet.fromPhrase(mnemonic.phrase);
  

  return { wallet, mnemonic: mnemonic.phrase };


}

function verifySignature(message, signature) {
  return verifyMessage(message, signature);
}


async function walletCreate() {

    const { wallet, mnemonic } = generateWalletFromSeed();

    await Wallets.create({
        
    })

}


async function transferOut(params) {
    
}