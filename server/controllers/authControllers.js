const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const RSA_PRIVATE_KEY =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex"); //יצירת מפתח אבטחה אקראי

const authLogin = async (req, res, next) => {
  //התחברות משתמש
  try {
    const { username, password } = req.body;
    const userExist = await User.findOne({
      username: username,
      password: password,
    });
    if (!userExist) {
      return res.status(401).json({ message: "שם משתמש או סיסמא לא תקינים" });
    }

    const userID = userExist._id;
    const userRole = userExist.role;
    const userNickName = userExist.nickName;

    const tokenData = jwt.sign(
      { id: userID, role: userRole, nickName: userNickName },
      RSA_PRIVATE_KEY
    );
    return res.status(200).json({ token: tokenData, connectedUser: userExist });
  } catch (err) {
    next(err);
  }
};

const authLogout = async (req, res, next) => {
  try {
    return res.status(200).json({ message: "התנתקת בהצלחה מהמערכת" });
  } catch (err) {
    next(err);
  }
};

const authenticateToken = async (req, res, next) => {
  //בדיקת טוקן  - אם ליוזר שהתחבר יש הרשאת כניסה לאתר
  let token = req.headers["x-access-token"];
  try {
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }
    jwt.verify(token, RSA_PRIVATE_KEY, async function (err, decoded) {
      if (err)
        return res
          .status(500)
          .json({ message: "Failed to authenticate token." });
      else {
        req.userConnect = {
          id: decoded.id,
          role: decoded.role,
        };
        next();
      }
    });
  } catch (err) {
    next(err);
  }
};

const checkUserRole = (role) => (req, res, next) => {
  //בדיקת תפקיד היוזר כדי לדעת אילו דפים להציג לו ואיזה לא
  const userRole = req.userConnect.role;
  if (userRole !== role) {
    return res
      .status(403)
      .json({ message: `Access forbidden. Required role: ${role}` });
  }
  next();
};

module.exports = { authLogin, authLogout, authenticateToken, checkUserRole };
