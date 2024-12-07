const express = require("express");
const router = express.Router();
const { createDonationOrder } = require("../controllers/createorder");

router.post("/", createDonationOrder);

module.exports = router;
