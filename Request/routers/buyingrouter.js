const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
  GetPendingRequests,
  AcceptRequest,
} = require("../controllers/buyinyrequest");
const { protectAgent } = require("../../middleware/authorization");

router.post("/", Create); // Protecting the Create route
router.post("/AcceptRequest/:id", protectAgent, AcceptRequest); // Protecting the Create route

router.get("/", ReadAll);
router.get("/Pending", GetPendingRequests);
router.get("/:id", ReadOne);

router.patch("/:id", Update);
router.delete("/:id", Delete);

module.exports = router;
