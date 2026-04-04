const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/computersDB_test";

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (err) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;
