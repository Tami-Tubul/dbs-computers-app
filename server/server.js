require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");

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

const connectdb = require("./config/database");
connectdb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server run in port ${PORT}`));
