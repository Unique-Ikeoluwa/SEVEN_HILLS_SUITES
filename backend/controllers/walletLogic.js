require("dotenv").config();
const { Wallet, Mnemonic } = require("ethers");
const crypto = require("crypto");
const db = require("../models");
const { Wallets } = db;
const { encrypt, decrypt } = require("../controllers/protect");

/**
 * High-entropy cryptographic Ethers v6 wallet generator
 */
async function walletGen() {
  const entropy = new Uint8Array(crypto.randomBytes(16));
  const mnemonic = Mnemonic.fromEntropy(entropy);
  const wallet = Wallet.fromPhrase(mnemonic.phrase);
  
  return { wallet, mnemonic: mnemonic.phrase };
}

/**
 * Creates and stores a new standalone wallet in the database
 */
async function walletCreate() {
  const { wallet, mnemonic } = await walletGen();
  const address = wallet.address;
  const seedPhrase = mnemonic;
  const encryptedPrivateKey = encrypt(wallet.privateKey);

  const walletRecord = await Wallets.create({
    public_address: address,
    balance: "0.0", // Starts with 0.0 Ether
    private_key: encryptedPrivateKey,
    mnemonic: seedPhrase
  });

  return walletRecord;
}

/**
 * Decrypts and retrieves the raw private key for a stored public address
 */
async function getDecryptedPrivateKey(address) {
  const walletRecord = await Wallets.findOne({
    where: { public_address: address }
  });

  if (!walletRecord) {
    throw new Error(`Wallet address ${address} not found in the database.`);
  }

  const decryptedKey = decrypt(walletRecord.private_key);
  if (!decryptedKey) {
    throw new Error(`Failed to decrypt private key for address ${address}.`);
  }

  return decryptedKey;
}

// Export functions for controller imports
module.exports = {
  walletGen,
  walletCreate,
  getDecryptedPrivateKey
};

/**
 * Standalone CLI Interface:
 * Triggered only when run directly (e.g., node controllers/walletLogic.js create)
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "create") {
    console.log("Generating secure admin blockchain wallet...");
    walletCreate()
      .then(wallet => {
        console.log("\n==================================================");
        console.log("✓ SUCCESS: Standalone Admin Wallet Created!");
        console.log("==================================================");
        console.log("Public Address :", wallet.public_address);
        console.log("Initial Balance:", wallet.balance, "ETH");
        console.log("Mnemonic Phrase:", wallet.mnemonic);
        console.log("Encrypted Key  :", wallet.private_key);
        console.log("==================================================\n");
        process.exit(0);
      })
      .catch(err => {
        console.error("Wallet creation failed:", err);
        process.exit(1);
      });
  } else {
    console.log("\nSeven Hills Admin Wallet CLI Tool");
    console.log("---------------------------------");
    console.log("Usage: node controllers/walletLogic.js create");
    console.log("Only runs on-demand when called explicitly.\n");
    process.exit(0);
  }
}