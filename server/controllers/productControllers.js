const Product = require("../models/productModel");

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

    //sort products by productName
    allProducts.sort((a, b) => naturalSort(a.productName, b.productName));

    // sort products by categories
    const productsByCategory = allProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
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

module.exports = { getProducts, getProductsByCategory, getCategories };
