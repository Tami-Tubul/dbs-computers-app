const express = require("express");
const app = express();
const authRoutes = require("./authRoutes");
const customerRoutes = require("./customerRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const transactionRoutes = require("./transactionRoutes");
const backupRoutes = require("./backupRoutes");

app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/transactions", transactionRoutes);
app.use("/backup", backupRoutes);

module.exports = app;
