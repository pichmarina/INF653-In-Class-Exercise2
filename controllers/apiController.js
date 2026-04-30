const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const recordModel = require("../models/recordModel");

async function login(req, res) {
  const { username, password } = req.body;
  const user = userModel.findByUsername(username);

  if (!user || !(await userModel.verifyPassword(user, password))) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET || "fallback_jwt_secret",
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
}

function getRecords(req, res) {
  const records = recordModel.getRecordsByUser(req.apiUser.id);
  const summary = recordModel.getSummaryByUser(req.apiUser.id);

  res.json({
    records,
    summary,
  });
}

module.exports = {
  login,
  getRecords,
};