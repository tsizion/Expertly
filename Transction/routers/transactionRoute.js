const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
  ReadAllByAgent,
  ReadOneByAgent,
} = require("../controllers/transactionController");
const { protectAgent } = require("../../middleware/authorization");

router.post("/", Create);
router.get("/", ReadAll);
router.get("/ReadAllByAgent", protectAgent, ReadAllByAgent);
router.get("/ReadOneByAgent", protectAgent, ReadOneByAgent);

router.get("/:id", ReadOne);
router.patch("/:id", Update);
router.delete("/:id", Delete);

module.exports = router;
