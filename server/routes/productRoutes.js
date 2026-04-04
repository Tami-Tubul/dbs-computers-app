const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductsByCategory,
  getCategories,
} = require("../controllers/productControllers");

const { authenticateToken } = require("../controllers/authControllers");

router.get("/", authenticateToken, getProducts);
router.post("/by-category", authenticateToken, getProductsByCategory);
router.get("/categories", authenticateToken, getCategories);

module.exports = router;
