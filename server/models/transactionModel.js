const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionName: {
      type: String,
      enum: ["הכנסה", "הוצאה"],
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["קבועה", "רגילה"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    fixedTransactionEndDate: {
      // for fixed transactions
      type: Date,
    },
    isFinished: {
      // for fixed transactions
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
