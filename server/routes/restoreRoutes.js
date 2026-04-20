const express = require("express");
const router = express.Router();
const { restoreBackup } = require("../controllers/restoreController");

router.post("/", restoreBackup);

module.exports = router;
