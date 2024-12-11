const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
  ReadOneByExpert,
  ChangeStatus,
} = require("../controllers/expertController");
const {
  protectAdmin,
  protectExpert,
} = require("../../middleware/authorization");

router.post("/", Create);
router.get("/", ReadAll);
router.get("/ReadOneByExpert", protectExpert, ReadOneByExpert);
router.get("/:id", ReadOne);
router.patch("/:id", Update);
router.patch("ChangeStatus/:id", ChangeStatus);

router.delete("/:id", Delete);

module.exports = router;
