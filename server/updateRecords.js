require("dotenv").config();
const mongoose = require("mongoose");
const Customer = require("./models/customerModel");
const Order = require("./models/orderModel");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Transaction = require("./models/transactionModel");

const connectdb = require("./config/database");

const func = async () => {
  try {
    console.log("Updating database...");
  } catch (error) {}
};

const runUpdate = async () => {
  try {
    await connectdb();

    if (!mongoose.connection.db) {
      throw new Error("Database connection is not established");
    }

    await func();
    console.log("Update finished successfully!");
  } catch (error) {
    console.error("Critical error in runUpdate:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

runUpdate();
