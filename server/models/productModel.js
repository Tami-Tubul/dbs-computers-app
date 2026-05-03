const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    /* ===== Core Fields ===== */
    productName: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    /* ===== Management ===== */
    location: {
      type: String,
      enum: ["דניאל", "שלומי"],
      default: "דניאל",
    },

    status: {
      type: String,
      enum: ["פעיל", "מושהה", "תקול", "נמכר"],
      default: "פעיל",
    },

    notes: {
      type: String,
    },

    /* ===== Specification & Pricing ===== */
    specification: {
      type: String,
    },

    dailyPrice: {
      type: Number,
      min: 0,
    },

    /* ===== Warranty ===== */
    warranty: {
      startDate: { type: Date },
      endDate: { type: Date },
    },

    /* ===== Computer Only ===== */
    computerDetails: {
      isAdvanced: {
        type: Boolean,
        default: false,
      },

      officeLicense: {
        type: String,
      },

      serialNumber: {
        type: String,
      },

      checkDate: {
        type: Date,
      },

      softwares: {
        type: [String],
      },
    },

    /* ===== Network Devices (Sticks / Routers) ===== */
    networkDetails: {
      filtering: {
        type: String,
      },

      active: {
        type: Boolean,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
