const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// sort products
const naturalSort = (a, b) => {
  const re = /(\d+)|(\D+)/g;

  const getParts = (str) => {
    return str
      .match(re)
      .map((part) => (isNaN(part) ? part : parseInt(part, 10)));
  };

  const aParts = getParts(a.toLowerCase());
  const bParts = getParts(b.toLowerCase());

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    if (aParts[i] < bParts[i]) return -1;
    if (aParts[i] > bParts[i]) return 1;
  }
  return aParts.length - bParts.length;
};

const getProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find({});

    const activeOrders = await Order.find({
      orderStatus: { $ne: "סגורה" },
    });

    const productToOrderMap = new Map();

    activeOrders.forEach((order) => {
      order.products.forEach((p) => {
        productToOrderMap.set(String(p.product), order);
      });
    });

    // sort products by productName
    allProducts.sort((a, b) => naturalSort(a.productName, b.productName));

    // sort products by categories + currentOrder
    const productsByCategory = allProducts.reduce((acc, product) => {
      const category = product.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      const order = productToOrderMap.get(String(product._id));

      acc[category].push({
        ...product.toObject(),
        currentOrder: order ? order._id : null,
      });

      return acc;
    }, {});

    // return new json for sorted array
    const sortedProducts = Object.keys(productsByCategory).map((category) => ({
      category,
      list: productsByCategory[category],
    }));

    return res.status(200).json({ products: sortedProducts });
  } catch (error) {
    next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  const { categoryName } = req.body;

  try {
    // search product by category
    const products = await Product.find({ category: categoryName });
    return res.status(200).json({ products: products });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = Product.schema.path("category").enumValues;
    return res.status(200).json({ categories: categories });
  } catch (error) {
    next(error);
  }
};

const addNewProduct = async (req, res, next) => {
  try {
    let { productName, category, ...rest } = req.body;

    productName = productName.trim();

    const existingProduct = await Product.findOne({ productName });

    if (existingProduct) {
      return res.status(400).json({
        message: "כבר קיים מוצר עם שם זה",
      });
    }

    const newProduct = await Product.create({
      productName,
      category,
      ...rest,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "מוצר לא נמצא" });
    }

    const isUsed = await Order.exists({
      "products.product": productId,
    });

    if (isUsed) {
      if (updates.productName && updates.productName !== product.productName) {
        return res.status(400).json({
          message: "לא ניתן לשנות שם מוצר שקיים בהזמנה",
        });
      }

      if (updates.category && updates.category !== product.category) {
        return res.status(400).json({
          message: "לא ניתן לשנות קטגוריה של מוצר שקיים בהזמנה",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const isUsed = await Order.exists({
      "products.product": productId,
    });

    if (isUsed) {
      return res.status(400).json({
        message: "לא ניתן למחוק מוצר שקיים בהזמנה",
      });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      message: "המוצר נמחק בהצלחה",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getCategories,
  addNewProduct,
  editProduct,
  deleteProduct,
};
