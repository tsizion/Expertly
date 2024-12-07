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
router.get("/", ReadAll);
router.get("/", protectAgent, ReadAllByAgent);
router.get("/", protectAgent, ReadOneByAgent);

router.get("/:id", ReadOne);
router.patch("/:id", Update);
router.delete("/:id", Delete);

module.exports = router;
