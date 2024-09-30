const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
} = require("../controllers/userController");
const { protectUser, protectAdmin } = require("../../middleware/authorization");
router.post("/", Create);
router.get("/", protectAdmin, ReadAll);
router.get("/:id", ReadOne);
router.patch("/:id", Update);
router.delete("/:id", Delete);

module.exports = router;
