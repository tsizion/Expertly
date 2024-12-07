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
} = require("../controllers/farmerController");
const { protectAgent } = require("../../middleware/authorization");

router.post("/", protectAgent, Create);
router.get("/ReadAll", ReadAll);
router.get("/ReadAllByAgent", protectAgent, ReadAllByAgent);
router.get("/ReadOneByAgent", protectAgent, ReadOneByAgent);

router.get("/:id", ReadOne);
router.patch("/:id", Update);
router.delete("/:id", Delete);

module.exports = router;
