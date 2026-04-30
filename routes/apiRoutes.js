const express = require("express");

const apiController = require("../controllers/apiController");
const { requireJwtAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/login", apiController.login);
router.get("/records", requireJwtAuth, apiController.getRecords);

module.exports = router;
