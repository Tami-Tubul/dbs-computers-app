require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const connectdb = require("./config/database");

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({ message: "API Running..." });
});

app.use("/api", apiRoutes);

//handle errors
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// start server only after DB connects
connectdb()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
