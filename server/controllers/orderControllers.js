const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const moment = require("moment-timezone");
const { updatePaymentsOnPriceChange } = require("../utils/payments");

const convertToDateWithTimeZone = (dateString) => {
  const timeZone = "Asia/Jerusalem";
  return moment.tz(dateString, timeZone).toDate();
};

const getOrders = async (req, res, next) => {
  try {
    const allOrders = await Order.find({})
      .populate("customer") // return customer object
      .populate("products.product") // return products objects array
      .populate("createdBy", "nickName");
    return res.status(200).json({ orders: allOrders });
  } catch (error) {
    next(error);
  }
};

const addNewOrder = async (req, res, next) => {
  const { customer, orderDate, orderPrice, products, mouseQuantity, delivery } =
    req.body;

  try {
    const formattedOrderDate = convertToDateWithTimeZone(orderDate);

    //add new order
    const newOrder = new Order({
      products: products, //object array: product obj + rentedAsAdvanced
      mouseQuantity,
      delivery: delivery?.enabled
        ? delivery
        : {
            enabled: false,
            go: { enabled: false, payment: false },
            back: { enabled: false, payment: false },
          },
      customer: customer, //customerId
      orderDate: formattedOrderDate,
      orderPrice: orderPrice || 0,
      orderStatus: "פתוחה",
      payments: [{ amount: orderPrice || 0, date: formattedOrderDate }],
      createdBy: req.userConnect.id,
    });

    const productIds = products.map((p) => p.product);

    //Check if the products exist in another order
    const unavailableProducts = await Product.find({
      _id: { $in: productIds },
      available: false,
    });
    if (unavailableProducts.length > 0) {
      return res.status(400).json({
        message: "חלק מהמוצרים תפוסים",
        unavailableProducts: unavailableProducts,
      });
    }

    // Update the 'available' field for the ordered products
    await Product.updateMany(
      { _id: { $in: productIds } }, // Find products where the _id is in the array of productIds
      { $set: { available: false } } // Set 'available' to false
    );

    await newOrder.save();

    // Populate the newly created order to include full customer and product information
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("customer")
      .populate("products.product")
      .populate("createdBy", "nickName");

    return res.status(201).json({
      newOrder: populatedOrder,
      addedProductIds: productIds,
    });
  } catch (error) {
    next(error);
  }
};

const editOrder = async (req, res, next) => {
  const orderid = req.params.id;
  const { customer, orderDate, orderPrice, products, mouseQuantity, delivery } =
    req.body;

  try {
    const existingOrder = await Order.findById(orderid);

    if (!existingOrder) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    const formattedOrderDate = convertToDateWithTimeZone(orderDate);

    //update products:

    //original products before edit
    const currentProductIds = existingOrder.products.map((p) =>
      p.product.toString()
    );

    const newProductIds = products.map((p) => p.product);

    //removed products
    const removedProductIds = currentProductIds.filter(
      (id) => !newProductIds.includes(id)
    );

    //new products
    const addedProductIds = newProductIds.filter(
      (id) => !currentProductIds.includes(id)
    );

    if (removedProductIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: removedProductIds } },
        { $set: { available: true } }
      );
    }

    if (addedProductIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: addedProductIds } },
        { $set: { available: false } }
      );
    }

    //If the orderPrice changes, the difference is recorded in the payments array to ensure each income is reflected in the correct month
    const priceDifference = (orderPrice || 0) - existingOrder.orderPrice;
    existingOrder.payments = updatePaymentsOnPriceChange(
      existingOrder.payments,
      priceDifference
    );

    //update other fields
    existingOrder.customer = customer ?? existingOrder.customer; //customerId
    existingOrder.orderDate = formattedOrderDate;
    existingOrder.orderPrice = orderPrice || 0;
    existingOrder.products = products; //object array: product obj + rentedAsAdvanced
    existingOrder.mouseQuantity = mouseQuantity;
    existingOrder.delivery = delivery?.enabled
      ? delivery
      : {
          enabled: false,
          go: { enabled: false, payment: false },
          back: { enabled: false, payment: false },
        };

    const updatedOrder = await existingOrder.save();

    // Populate the updated order to include full customer and product information
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("customer")
      .populate("products.product")
      .populate("createdBy", "nickName");

    return res.status(200).json({
      updatedOrder: populatedOrder,
      addedProductIds,
      removedProductIds,
    });
  } catch (error) {
    next(error);
  }
};

const closeOrder = async (req, res, next) => {
  const orderid = req.params.id;
  const { orderPrice, remainingPrice, closeDate, delivery } = req.body;

  try {
    // Find the order to be closed
    const orderToClose = await Order.findById(orderid);
    if (!orderToClose) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    // Get the product IDs from the order
    const productIds = orderToClose.products.map((p) => p.product);

    // Update the 'available' field for the products to true
    if (productIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { available: true } }
      );
    }

    const formattedCloseDate = convertToDateWithTimeZone(closeDate);

    // Update payments if orderPrice has changed
    const priceDifference = (orderPrice || 0) - orderToClose.orderPrice;
    orderToClose.payments = updatePaymentsOnPriceChange(
      orderToClose.payments,
      priceDifference
    );

    // Update other fields
    orderToClose.orderPrice = orderPrice || 0;
    orderToClose.remainingPrice = remainingPrice || 0;
    orderToClose.closeDate = formattedCloseDate;
    orderToClose.orderStatus = "סגורה";

    if (delivery) {
      orderToClose.delivery = delivery.enabled
        ? delivery
        : {
            enabled: false,
            go: { enabled: false, payment: false },
            back: { enabled: false, payment: false },
          };
    }

    const closedOrder = await orderToClose.save();

    const populatedOrder = await Order.findById(closedOrder._id)
      .populate("customer")
      .populate("products.product")
      .populate("createdBy", "nickName");

    return res
      .status(200)
      .json({ closedOrder: populatedOrder, removedProductIds: productIds });
  } catch (error) {
    next(error);
  }
};

const editClosedOrder = async (req, res, next) => {
  const orderid = req.params.id;
  const { orderPrice, remainingPrice, delivery } = req.body;

  try {
    const existingOrder = await Order.findById(orderid);

    if (!existingOrder) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    //If the orderPrice changes, the difference is recorded in the payments array to ensure each income is reflected in the correct month
    const priceDifference = (orderPrice || 0) - existingOrder.orderPrice;
    existingOrder.payments = updatePaymentsOnPriceChange(
      existingOrder.payments,
      priceDifference
    );

    //update other fields
    existingOrder.orderPrice = orderPrice || 0;
    existingOrder.remainingPrice = remainingPrice || 0;

    if (delivery) {
      existingOrder.delivery = delivery.enabled
        ? delivery
        : {
            enabled: false,
            go: { enabled: false, payment: false },
            back: { enabled: false, payment: false },
          };
    }

    const updatedClosedOrder = await existingOrder.save();

    // Populate the updated order to include full customer and product information
    const populatedClosedOrder = await Order.findById(updatedClosedOrder._id)
      .populate("customer")
      .populate("products.product")
      .populate("createdBy", "nickName");

    return res.status(200).json(populatedClosedOrder);
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  const orderid = req.params.id;

  try {
    // Find the order to be deleted
    const orderToClose = await Order.findById(orderid);
    if (!orderToClose) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    // Get the product IDs from the order
    const productIds = orderToClose.products.map((p) => p.product);

    // Update the 'available' field for the products to true
    if (productIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { available: true } }
      );
    }

    // Delete the order
    await Order.findByIdAndDelete(orderid);

    res
      .status(200)
      .json({ message: "ההזמנה נמחקה בהצלחה", removedProductIds: productIds });
  } catch (error) {
    next(error);
  }
};

const reopenOrder = async (req, res, next) => {
  const orderid = req.params.id;

  try {
    // Find the order
    const order = await Order.findById(orderid);

    if (!order) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    if (order.orderStatus !== "סגורה") {
      return res
        .status(400)
        .json({ message: "רק הזמנה סגורה יכולה להיפתח מחדש" });
    }

    const productIds = order.products.map((p) => p.product);

    // Check if any of the products are unavailable (i.e., already used in another open order)
    const unavailableProducts = await Product.find({
      _id: { $in: productIds },
      available: false,
    });

    if (unavailableProducts.length > 0) {
      return res.status(400).json({
        message:
          "לא ניתן לפתוח את ההזמנה מחדש, כיוון שאחד או יותר מהמוצרים הכלולים בה תפוסים בהזמנה אחרת. יש לשחררם לפני פתיחה מחדש.",
        unavailableProducts,
      });
    }

    // Mark products as unavailable (taken)
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { available: false } }
    );

    // Update the order status
    order.orderStatus = "פתוחה";
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("products.product")
      .populate("createdBy", "nickName");

    return res.status(200).json({
      message: "ההזמנה נפתחה מחדש בהצלחה",
      reopenedOrder: populatedOrder,
      affectedProducts: productIds,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  addNewOrder,
  editOrder,
  closeOrder,
  editClosedOrder,
  deleteOrder,
  reopenOrder,
};
