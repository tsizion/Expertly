const express = require("express");
const router = express.Router();
const { initializePayment } = require("./payment");
const {
  protectAdmin,
  protectExpert,
  protectClient,
} = require("../middleware/authorization");

router.post("/:appointmentId", protectClient, initializePayment);

module.exports = router;
