const express = require("express");
const router = express.Router();
const {
  getCustomers,
  addNewCustomer,
  editCustomer,
  deleteCustomer,
} = require("../controllers/customerControllers");
const { authenticateToken } = require("../controllers/authControllers");

router.get("/", authenticateToken, getCustomers);
router.post("/addCustomer", authenticateToken, addNewCustomer);
router.put("/editCustomer/:id", authenticateToken, editCustomer);
router.delete("/deleteCustomer/:id", authenticateToken, deleteCustomer);

module.exports = router;
