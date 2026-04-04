const Transaction = require("../models/transactionModel");
const Order = require("../models/transactionModel");
const moment = require("moment-timezone");

// Middleware to check if the user is the creator of the transaction or an admin
const checkOwnershipOrAdmin = async (req, res, next) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "הפעולה לא נמצאה" });
    }

    if (
      req.userConnect.role !== "admin" &&
      transaction.createdBy.toString() !== req.userConnect.id
    ) {
      return res.status(403).json({ message: "אין לך הרשאות לביצוע פעולה זו" });
    }

    req.transaction = transaction;
    next();
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    let filter = {};
    if (req.userConnect.role !== "admin") {
      filter = { createdBy: req.userConnect.id };
    }

    const allTransactions = await Transaction.find(filter).populate(
      "createdBy",
      "nickName"
    ); // Populate the createdBy field with user details
    return res.status(200).json({ transactions: allTransactions });
  } catch (error) {
    next(error);
  }
};

const addNewTransaction = async (req, res, next) => {
  const {
    transactionName,
    transactionType,
    amount,
    transactionDate,
    fixedTransactionEndDate,
    description,
    createdBy,
  } = req.body;

  try {
    // if admin, can create on behalf of another user
    const creatorId =
      req.userConnect.role === "admin"
        ? createdBy || req.userConnect.id
        : req.userConnect.id;

    // Create a new transaction
    const newTransaction = new Transaction({
      transactionName,
      transactionType,
      amount,
      transactionDate,
      fixedTransactionEndDate,
      description,
      isFinished: false,
      createdBy: creatorId,
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Populate the newly created transaction to include full user details
    const populatedTransaction = await Transaction.findById(
      newTransaction._id
    ).populate("createdBy", "nickName");

    return res.status(201).json(populatedTransaction);
  } catch (error) {
    next(error);
  }
};

const editTransaction = async (req, res, next) => {
  const {
    transactionName,
    transactionType,
    amount,
    transactionDate,
    fixedTransactionEndDate,
    description,
    createdBy,
  } = req.body;

  try {
    req.transaction.transactionName = transactionName;
    req.transaction.transactionType = transactionType;
    req.transaction.amount = amount;
    req.transaction.transactionDate = transactionDate;
    req.transaction.fixedTransactionEndDate = fixedTransactionEndDate;
    req.transaction.description = description;
    req.transaction.isFinished = false;

    // admin can change the creator, regular user cannot
    if (req.userConnect.role === "admin") {
      req.transaction.createdBy = createdBy || req.transaction.createdBy;
    }

    await req.transaction.save();

    // Populate the updated transaction to include full user details
    const populatedTransaction = await Transaction.findById(
      req.transaction._id
    ).populate("createdBy", "nickName");

    return res.status(200).json(populatedTransaction);
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    // Delete the transaction
    await Transaction.findByIdAndDelete(req.transaction._id);
    res.status(200).json({ message: "הפעולה נמחקה בהצלחה" });
  } catch (error) {
    next(error);
  }
};

const finishTransaction = async (req, res, next) => {
  try {
    req.transaction.fixedTransactionEndDate = moment().format("YYYY-MM-DD");
    req.transaction.isFinished = true;

    await req.transaction.save();
    return res.status(200).json({ message: "הפעולה הסתיימה בהצלחה" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkOwnershipOrAdmin,
  getTransactions,
  addNewTransaction,
  editTransaction,
  deleteTransaction,
  finishTransaction,
};
