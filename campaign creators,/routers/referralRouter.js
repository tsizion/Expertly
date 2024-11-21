const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
} = require("../controllers/referralController");
const { protectUser, protectAdmin } = require("../../middleware/authorization");

router.post("/", protectUser, Create); // Protecting the Create route
router.get("/", protectAdmin, ReadAll);
router.get("/:id", ReadOne);
router.patch("/:id", Update);
router.delete("/:id", protectAdmin, Delete);

module.exports = router;
