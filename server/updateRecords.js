require("dotenv").config();
const mongoose = require("mongoose");
const Customer = require("./models/customerModel");
const Order = require("./models/orderModel");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Transaction = require("./models/transactionModel");

const connectdb = require("./config/database");
connectdb();

const func = async () => {
  try {
  } catch (error) {}
};

const runUpdate = async () => {
  await func();
  mongoose.connection.close();
};

runUpdate();
