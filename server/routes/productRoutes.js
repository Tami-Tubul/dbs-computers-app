const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductsByCategory,
  getCategories,
  addNewProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const { authenticateToken } = require("../controllers/authControllers");

router.get("/", authenticateToken, getProducts);
router.post("/by-category", authenticateToken, getProductsByCategory);
router.get("/categories", authenticateToken, getCategories);
router.post("/addProduct", authenticateToken, addNewProduct);
router.put("/editProduct/:productId", authenticateToken, editProduct);
router.delete("/deleteProduct/:productId", authenticateToken, deleteProduct);

module.exports = router;
