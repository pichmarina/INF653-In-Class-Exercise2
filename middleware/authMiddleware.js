const jwt = require("jsonwebtoken");

function requireSessionAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  next();
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/records");
  }

  next();
}

function requireJwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.apiUser = jwt.verify(token, process.env.JWT_SECRET || "fallback_jwt_secret");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  requireSessionAuth,
  redirectIfLoggedIn,
  requireJwtAuth,
};