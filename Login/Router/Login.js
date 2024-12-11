const express = require("express");
const router = express.Router();
const { LoginExpert, LoginAdmin, LoginClient } = require("../Controller/login");

router.post("/Expert", LoginExpert); // Read all users
router.post("/Admin", LoginAdmin); // Read all users
router.post("/Client", LoginClient); // Read all users

module.exports = router;
