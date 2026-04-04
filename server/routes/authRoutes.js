const express = require("express");
const router = express.Router();
const { authLogin, authLogout } = require("../controllers/authControllers");

router.post("/login", authLogin);
router.post("/logout", authLogout);

module.exports = router;
