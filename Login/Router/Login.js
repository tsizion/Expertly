const express = require("express");
const router = express.Router();
const { LoginAgent } = require("../Controller/login");

router.post("/Agent", LoginAgent); // Read all users

module.exports = router;
