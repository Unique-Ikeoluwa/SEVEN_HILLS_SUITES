const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletLogic");
const { authMiddleware, adminMiddleware } = require("../middlewares/authUserMiddleware");

// All admin wallet routes require auth and admin middleware checks
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", walletController.getWalletDetails);
router.get("/mnemonic", walletController.showMnemonic);
router.get("/history", walletController.getWalletHistory);
router.post("/transfer", walletController.transferFunds);

module.exports = router;