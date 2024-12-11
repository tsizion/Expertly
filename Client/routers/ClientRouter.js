const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
  readOneByClient,
} = require("../controllers/ClientControllers");
const {
  protectAdmin,
  protectClient,
} = require("../../middleware/authorization");

router.post("/", Create);
router.get("/readOneByClient", protectClient, readOneByClient);
router.get("/", ReadAll);
router.get("/:id", ReadOne);
router.patch("/", protectClient, Update);
router.delete("/:id", Delete);

module.exports = router;
