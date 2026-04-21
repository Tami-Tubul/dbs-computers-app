const mongoose = require("mongoose");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../utils/s3Client");
const { EJSON } = require("bson");
const zlib = require("zlib");

// Import Mongoose models
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");

// Map collection names to their respective Mongoose models
const modelMap = {
  customers: Customer,
  orders: Order,
  users: User,
  products: Product,
  transactions: Transaction,
};

const restoreFromS3 = async (fileKey, targetDbUri) => {
  console.log("[Restore] Checking database connection...");

  if (mongoose.connection.readyState !== 0) {
    console.log(
      "[Restore] Closing existing connection before re-connecting...",
    );
    await mongoose.disconnect();
  }

  console.log("[Restore] Connecting to target database...");
  await mongoose.connect(targetDbUri);
  const db = mongoose.connection.db;

  const data = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
    }),
  );

  // Pipe the S3 body stream through Gunzip to decompress
  const gunzip = zlib.createGunzip();
  const uncompressedStream = data.Body.pipe(gunzip);

  // Helper to convert the stream to a string
  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (c) => chunks.push(c));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });

  const json = await streamToString(uncompressedStream);

  // EJSON.parse converts the serialized BSON structures back to JavaScript objects
  const backup = EJSON.parse(json);

  for (const [collectionName, docs] of Object.entries(backup)) {
    const Model = modelMap[collectionName];

    if (Model) {
      // Use Mongoose models to perform insertion
      await Model.deleteMany({});
      if (docs.length > 0) await Model.insertMany(docs);
      console.log(
        `[Restore] Successfully restored ${collectionName} using Mongoose model.`,
      );
    } else {
      // Fallback: Use native driver
      console.warn(
        `[Restore] No model found for ${collectionName}. Using native driver.`,
      );
      const collection = db.collection(collectionName);
      await collection.deleteMany({});
      if (docs.length > 0) await collection.insertMany(docs);
    }
  }

  await mongoose.disconnect();
  console.log("[Restore] Restore process completed.");
};

module.exports = { restoreFromS3 };
