const express = require("express");
const csrf = require("csurf");

const authController = require("../controllers/authController");
const recordController = require("../controllers/recordController");
const {
  requireSessionAuth,
  redirectIfLoggedIn,
} = require("../middleware/authMiddleware");

const router = express.Router();
const csrfProtection = csrf();

router.get("/", (req, res) => {
  res.redirect("/records");
});

router.get("/register", csrfProtection, redirectIfLoggedIn, authController.showRegister);
router.post("/register", csrfProtection, redirectIfLoggedIn, authController.register);

router.get("/login", csrfProtection, redirectIfLoggedIn, authController.showLogin);
router.post("/login", csrfProtection, redirectIfLoggedIn, authController.login);

router.post("/logout", csrfProtection, requireSessionAuth, authController.logout);

router.get("/records", requireSessionAuth, recordController.index);
router.get("/records/add", csrfProtection, requireSessionAuth, recordController.showAddForm);
router.post("/records", csrfProtection, requireSessionAuth, recordController.create);
router.get("/records/:id/edit", csrfProtection, requireSessionAuth, recordController.showEditForm);
router.put("/records/:id", csrfProtection, requireSessionAuth, recordController.update);
router.delete("/records/:id", csrfProtection, requireSessionAuth, recordController.remove);

module.exports = router;