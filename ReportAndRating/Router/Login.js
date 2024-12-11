const express = require("express");
const router = express.Router();
const { LoginAgent, LoginAdmin } = require("../Controller/login");

router.post("/Agent", LoginAgent); // Read all users
router.post("/Admin", LoginAdmin); // Read all users

module.exports = router;
