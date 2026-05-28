require("dotenv").config();
const { Wallet, Mnemonic } = require("ethers");
const crypto = require("crypto");
const db = require("../models");
const { Wallets } = db;
const { encrypt, decrypt } = require("../controllers/protect");


async function walletGen() {
  const entropy = new Uint8Array(crypto.randomBytes(16));
  const mnemonic = Mnemonic.fromEntropy(entropy);
  const wallet = Wallet.fromPhrase(mnemonic.phrase);
  
  return { wallet, mnemonic: mnemonic.phrase };
}


async function walletCreate() {
  const { wallet, mnemonic } = await walletGen();
  const address = wallet.address;
  const seedPhrase = mnemonic;
  const encryptedPrivateKey = encrypt(wallet.privateKey);

  const walletRecord = await Wallets.create({
    public_address: address,
    balance: "0.0", 
    private_key: encryptedPrivateKey,
    mnemonic: seedPhrase
  });

  return walletRecord;
}

async function getWalletDetails(req, res) {
  try {
    const wallet = await Wallets.findOne({ order: [["id", "DESC"]] });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "No admin blockchain wallet has been generated yet.",
      });
    }

    return res.status(200).json({
      success: true,
      wallet: {
        address: wallet.public_address,
        balance: wallet.balance,
      },
    });
  } catch (error) {
    console.error("Get Wallet Details Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching wallet details.",
      error: error.message,
    });
  }
}


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


async function showMnemonic(req, res) {
  try {
    const wallet = await Wallets.findOne({ order: [["id", "DESC"]] });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "No admin blockchain wallet has been generated yet.",
      });
    }

    const decryptedKey = await getDecryptedPrivateKey(wallet.public_address);

    return res.status(200).json({
      success: true,
      wallet: {
        address: wallet.public_address,
        mnemonic: wallet.mnemonic,
        private_key: decryptedKey,
      },
    });
  } catch (error) {
    console.error("Show Mnemonic Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving mnemonic.",
      error: error.message,
    });
  }
}

async function transferFunds(req, res) {
  try {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
      return res.status(400).json({
        success: false,
        message: "Recipient address (toAddress) and amount are required.",
      });
    }

    const { isAddress } = require("ethers");
    if (!isAddress(toAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient Ethereum address format.",
      });
    }

    const dbWallet = await Wallets.findOne({ order: [["id", "DESC"]] });
    if (!dbWallet) {
      return res.status(404).json({
        success: false,
        message: "No admin blockchain wallet has been generated yet.",
      });
    }

    const decryptedKey = await getDecryptedPrivateKey(dbWallet.public_address);

    // Dynamic blockchain interaction
    const rpcUrl = process.env.ETH_RPC_URL;
    if (!rpcUrl) {
      // Simulation Mode (Mock execution when ETH_RPC_URL is not configured)
      console.log("[ETH WALLET] Simulation Mode active (no ETH_RPC_URL defined). Simulating transfer...");
      const simulatedHash = "0x" + crypto.randomBytes(32).toString("hex");
      
      let currentBal = parseFloat(dbWallet.balance) || 0;
      let transferAmt = parseFloat(amount);
      if (currentBal >= transferAmt) {
        dbWallet.balance = (currentBal - transferAmt).toFixed(6);
        await dbWallet.save();
      } else {
        return res.status(400).json({
          success: false,
          message: `Insufficient funds for transfer. Available: ${currentBal} ETH, Requested: ${transferAmt} ETH`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Transfer successful (SIMULATION MODE)!",
        data: {
          txHash: simulatedHash,
          from: dbWallet.public_address,
          to: toAddress,
          amount: transferAmt.toFixed(6) + " ETH",
          newBalance: dbWallet.balance + " ETH",
          confirmations: 1,
          is_simulated: true,
        },
      });
    }

    // Real blockchain execution
    const { JsonRpcProvider, Wallet, parseEther, formatEther } = require("ethers");
    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(decryptedKey, provider);

    const parsedAmount = parseEther(amount.toString());

    // Check actual wallet balance on-chain
    const balanceWei = await provider.getBalance(wallet.address);
    if (balanceWei < parsedAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient on-chain balance to proceed. Available: ${formatEther(balanceWei)} ETH, Requested: ${amount} ETH`,
      });
    }

    // Broadcast transaction
    console.log(`[ETH WALLET] Sending real transfer from ${wallet.address} to ${toAddress} of amount ${amount} ETH...`);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: parsedAmount,
    });

    const receipt = await tx.wait();

    // Fetch and update database balance
    const updatedBalanceWei = await provider.getBalance(wallet.address);
    const newBalString = formatEther(updatedBalanceWei);
    dbWallet.balance = newBalString;
    await dbWallet.save();

    return res.status(200).json({
      success: true,
      message: "Transfer completed and confirmed on-chain successfully!",
      data: {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        from: wallet.address,
        to: toAddress,
        amount: amount.toString() + " ETH",
        newBalance: newBalString + " ETH",
        confirmations: receipt.confirmations,
      },
    });
  } catch (error) {
    console.error("Transfer Funds Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while executing the transaction.",
      error: error.message,
    });
  }
}

async function getWalletHistory(req, res) {
  try {
    const dbWallet = await Wallets.findOne({ order: [["id", "DESC"]] });
    if (!dbWallet) {
      return res.status(404).json({
        success: false,
        message: "No admin blockchain wallet has been generated yet.",
      });
    }

    const address = dbWallet.public_address;

    // Check if we are running in live mode or simulation mode
    const rpcUrl = process.env.ETH_RPC_URL;
    if (!rpcUrl) {
      // Simulation mode fallback
      console.log("[ETH WALLET] Simulation Mode active (no ETH_RPC_URL). Returning simulated history...");
      return res.status(200).json({
        success: true,
        message: "Transactions retrieved successfully (SIMULATION MODE)!",
        address: address,
        count: 2,
        transactions: [
          {
            hash: "0x894cdc18def3810fb378fd312f8f56763c185ff98753fd78fab49f6e111f997a",
            blockNumber: "19283746",
            timeStamp: Math.floor(Date.now() / 1000 - 3600).toString(),
            from: address,
            to: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
            value: "1250000000000000000",
            formattedValue: "1.25 ETH",
            gas: "21000",
            gasPrice: "30000000000",
            confirmations: "120",
            isError: "0",
            txreceipt_status: "1",
            is_simulated: true,
          },
          {
            hash: "0x3ab3717df3d17983637fe17ebcb221a7c5b6abfe2c34bc1a4f89d311fef8e72b",
            blockNumber: "19280012",
            timeStamp: Math.floor(Date.now() / 1000 - 86400).toString(),
            from: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
            to: address,
            value: "5500000000000000000",
            formattedValue: "5.5 ETH",
            gas: "21000",
            gasPrice: "25000000000",
            confirmations: "340",
            isError: "0",
            txreceipt_status: "1",
            is_simulated: true,
          }
        ]
      });
    }

    // Live Mainnet Etherscan fetch
    console.log(`[ETH WALLET] Fetching transaction history for ${address} from Etherscan Mainnet...`);
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY || ""; 
    const apiKeyParam = etherscanApiKey ? `&apikey=${etherscanApiKey}` : "";
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc${apiKeyParam}`;

    let txList = [];
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.status === "1" && Array.isArray(result.result)) {
        const { formatEther } = require("ethers");
        txList = result.result.map(tx => ({
          hash: tx.hash,
          blockNumber: tx.blockNumber,
          timeStamp: tx.timeStamp,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          formattedValue: `${formatEther(tx.value)} ETH`,
          gas: tx.gas,
          gasPrice: tx.gasPrice,
          confirmations: tx.confirmations,
          isError: tx.isError,
          txreceipt_status: tx.txreceipt_status,
          date: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        }));
      } else {
        console.warn(`[ETH WALLET] Etherscan returned status ${result.status}: ${result.message}`);
        throw new Error(result.message || "Failed to fetch from Etherscan");
      }
    } catch (fetchErr) {
      console.warn("[ETH WALLET] Etherscan fetch failed or rate-limited. Falling back to DB payments query...", fetchErr.message);
      
      const dbPayments = await db.Payments.findAll({
        where: {
          payment_method: "crypto",
          payment_status: "paid"
        },
        order: [["createdAt", "DESC"]]
      });

      txList = dbPayments.map(p => ({
        hash: p.transaction_reference || "N/A",
        blockNumber: "N/A",
        timeStamp: Math.floor(new Date(p.createdAt).getTime() / 1000).toString(),
        from: "User / External",
        to: address,
        value: "N/A",
        formattedValue: `${p.amount} ${p.currency}`,
        gas: "N/A",
        gasPrice: "N/A",
        confirmations: "Confirmed",
        isError: "0",
        txreceipt_status: "1",
        date: p.createdAt,
        is_from_db: true,
      }));
    }

    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully!",
      address: address,
      count: txList.length,
      transactions: txList,
    });
  } catch (error) {
    console.error("Get Wallet History Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while compiling transaction history.",
      error: error.message,
    });
  }
}

module.exports = {
  walletGen,
  walletCreate,
  getDecryptedPrivateKey,
  getWalletDetails,
  showMnemonic,
  transferFunds,
  getWalletHistory
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