const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const usersFile = path.join(dataDir, "users.json");

function loadUsers() {
  if (!fs.existsSync(usersFile)) {
    return [];
  }

  const fileContent = fs.readFileSync(usersFile, "utf8");

  if (!fileContent.trim()) {
    return [];
  }

  return JSON.parse(fileContent);
}

function saveUsers(users) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

async function createUser({ username, password }) {
  const users = loadUsers();
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    username,
    passwordHash,
  };

  users.push(user);
  saveUsers(users);

  return user;
}

function findByUsername(username) {
  const users = loadUsers();
  return users.find((user) => user.username === username);
}

function findById(id) {
  const users = loadUsers();
  return users.find((user) => user.id === Number(id));
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

module.exports = {
  createUser,
  findByUsername,
  findById,
  verifyPassword,
};
