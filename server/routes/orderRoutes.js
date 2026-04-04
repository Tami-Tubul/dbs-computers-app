const express = require("express");
const router = express.Router();
const {
  getOrders,
  addNewOrder,
  editOrder,
  closeOrder,
  editClosedOrder,
  deleteOrder,
  reopenOrder,
} = require("../controllers/orderControllers");
const { authenticateToken } = require("../controllers/authControllers");

router.get("/", authenticateToken, getOrders);
router.post("/addOrder", authenticateToken, addNewOrder);
router.put("/editOrder/:id", authenticateToken, editOrder);
router.put("/closeOrder/:id", authenticateToken, closeOrder);
router.put("/reopenOrder/:id", authenticateToken, reopenOrder);
router.put("/editClosedOrder/:id", authenticateToken, editClosedOrder);
router.delete("/deleteOrder/:id", authenticateToken, deleteOrder);

module.exports = router;
