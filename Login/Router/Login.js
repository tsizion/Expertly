const express = require("express");
const router = express.Router();
const { Login, LoginAdmin } = require("../Controller/login");

router.post("/", Login); // Read all users
router.post("/admin", LoginAdmin); // Read all users

module.exports = router;
