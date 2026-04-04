const Customer = require("../models/customerModel");

const getCustomers = async (req, res, next) => {
  try {
    const allCustomers = await Customer.find({});
    return res.status(200).json({ customers: allCustomers });
  } catch (error) {
    next(error);
  }
};

const addNewCustomer = async (req, res, next) => {
  const { firstname, lastname, phone, email, address } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ phone: phone });
    if (existingCustomer) {
      return res.status(400).json({ message: "לקוח זה קיים במערכת!" });
    }

    // Create a new customer
    const newCustomer = new Customer({
      firstname,
      lastname,
      phone,
      email,
      address,
    });

    // Save the customer to the database
    await newCustomer.save();

    return res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};

const editCustomer = async (req, res, next) => {
  const customerid = req.params.id;
  const { firstname, lastname, phone, email, address } = req.body;

  try {
    // Check if the phone number exists for another customer
    const existingCustomerWithPhone = await Customer.findOne({
      phone,
      _id: { $ne: customerid },
    });
    if (existingCustomerWithPhone) {
      return res
        .status(400)
        .json({ message: "מספר טלפון זה כבר קיים אצל לקוח אחר!" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerid,
      { firstname, lastname, phone, email, address },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "לקוח לא נמצא" });
    }

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, addNewCustomer, editCustomer };
