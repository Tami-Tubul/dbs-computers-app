const User = require("../models/userModel");

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).json({ users: allUsers });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users: [user] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById };
