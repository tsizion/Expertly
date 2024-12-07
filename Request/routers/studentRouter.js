const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
} = require("../controllers/studentController");
const {} = require("../../middleware/authorization"); // Protect user middleware

router.post("/", Create); // User must be logged in to create a student info entry

router.get("/", ReadAll); // Only logged-in users can access

router.get("/:id", ReadOne); // Only logged-in users can access

router.patch("/:id", Update); // Only logged-in users can access

router.delete("/:id", Delete); // Only logged-in users can access

module.exports = router;
