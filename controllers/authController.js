const userModel = require("../models/userModel");

function showRegister(req, res) {
  res.render("auth/register", {
    csrfToken: req.csrfToken(),
  });
}

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("auth/register", {
        error: "Username and password are required",
        csrfToken: req.csrfToken(),
      });
    }

    const user = await userModel.createUser({ username, password });
    req.session.userId = user.id;

    req.session.save(() => {
      res.redirect("/records");
    });
  } catch (error) {
    res.status(400).render("auth/register", {
      error: error.message,
      csrfToken: req.csrfToken(),
    });
  }
}

function showLogin(req, res) {
  res.render("auth/login", {
    csrfToken: req.csrfToken(),
  });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = userModel.findByUsername(username);

  if (!user || !(await userModel.verifyPassword(user, password))) {
    return res.status(401).render("auth/login", {
      error: "Invalid username or password",
      csrfToken: req.csrfToken(),
    });
  }

  req.session.userId = user.id;

  req.session.save(() => {
    res.redirect("/records");
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout,
};
