const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        "מחשבים",
        "סטיקים",
        "ראוטרים",
        "מסכים",
        "מקרנים",
        "רמקולים",
        "אונקי",
        "טאבלטים",
      ],
    },
    dailyPrice: {
      type: Number,
    },
    company: {
      type: String,
    },
    specification: {
      type: String,
    },
    softwares: {
      // for computers
      type: Array,
    },
    checkDate: {
      // for computers
      type: Date,
    },
    validityWarranty: {
      // for computers
      type: Date,
    },
    isAdvanced: {
      // for computers
      type: Boolean,
      default: false,
    },
    filtering: {
      // for sticks & routers
      type: String,
    },
    active: {
      // for sticks & routers
      type: Boolean,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
