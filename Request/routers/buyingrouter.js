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

router.post("/", Create); // Protecting the Create route
router.post("/AcceptRequest", AcceptRequest); // Protecting the Create route

router.get("/", ReadAll);
router.get("/Pending", GetPendingRequests);
router.get("/:id", ReadOne);

router.patch("/:id", Update);
router.delete("/:id", Delete);

module.exports = router;
