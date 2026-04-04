const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addNewTransaction,
  editTransaction,
  deleteTransaction,
  finishTransaction,
  checkOwnershipOrAdmin,
} = require("../controllers/transactionControllers");
const { authenticateToken } = require("../controllers/authControllers");

router.get("/", authenticateToken, getTransactions);
router.post("/addTransaction", authenticateToken, addNewTransaction);
router.put(
  "/editTransaction/:id",
  authenticateToken,
  checkOwnershipOrAdmin,
  editTransaction
);
router.delete(
  "/deleteTransaction/:id",
  authenticateToken,
  checkOwnershipOrAdmin,
  deleteTransaction
);
router.put(
  "/finishTransaction/:id",
  authenticateToken,
  checkOwnershipOrAdmin,
  finishTransaction
);

module.exports = router;
