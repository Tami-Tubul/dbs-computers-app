const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        rentedAsAdvanced: {
          type: Boolean,
          default: false,
        },
      },
    ],
    mouseQuantity: {
      type: Number,
      default: 0,
    },
    delivery: {
      enabled: {
        type: Boolean,
        default: false,
      },
      go: {
        enabled: {
          type: Boolean,
          default: false,
        },
        payment: {
          type: Boolean,
          default: false,
        },
      },
      back: {
        enabled: {
          type: Boolean,
          default: false,
        },
        payment: {
          type: Boolean,
          default: false,
        },
      },
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderPrice: {
      type: Number,
      default: 0,
    },
    payments: [
      {
        amount: {
          //The difference between the new and old price
          type: Number,
          default: 0,
          required: true,
        },
        date: {
          //Date of change of the amount
          type: Date,
          default: Date.now,
          required: true,
        },
      },
    ],
    orderStatus: {
      type: String,
      default: "פתוחה",
    },
    remainingPrice: {
      type: Number,
      default: 0,
    },
    closeDate: {
      type: Date,
      default: Date.now,
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

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
