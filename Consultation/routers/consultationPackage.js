const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
  ReadAllByExpert,
  ReadOneByExpert,
} = require("../controllers/ConsultationController");
const { protectExpert } = require("../../middleware/authorization");

router.post("/", protectExpert, Create);
router.get("/", ReadAll);
router.get("/:id", ReadOne);
router.get("/ReadAllByExpert", protectExpert, ReadAllByExpert);
router.get("/ReadOneByExpert/:id", protectExpert, ReadOneByExpert);
router.patch("/:id", protectExpert, Update);
router.delete("/:id", protectExpert, Delete);

module.exports = router;
