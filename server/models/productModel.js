const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    /* ===== Core Fields ===== */
    productName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

    company: {
      type: String,
      default: "",
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
      default: "",
    },

    /* ===== Specification & Pricing ===== */
    specification: {
      type: String,
      default: "",
    },

    dailyPrice: {
      type: Number,
      min: 0,
      default: 20,
    },

    /* ===== Warranty ===== */
    warranty: {
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },

    /* ===== Computer Only ===== */
    computerDetails: {
      type: {
        isAdvanced: {
          type: Boolean,
          default: false,
        },
        officeLicense: {
          type: String,
          default: "",
        },
        serialNumber: {
          type: String,
          default: "",
        },
        checkDate: {
          type: Date,
          default: null,
        },
        softwares: {
          type: [String],
          default: [],
        },
      },
      default: {},
    },

    /* ===== Network Devices (Sticks / Routers) ===== */
    networkDetails: {
      type: {
        simDetails: {
          type: {
            phoneNumber: { type: String, default: "" },
            simNumber: { type: String, default: "" },
            carrierCompany: { type: String, default: "" },
          },
          default: {},
        },

        wifiDetails: {
          type: {
            ssid: { type: String, default: "" },
            password: { type: String, default: "" },
          },
          default: {},
        },
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
