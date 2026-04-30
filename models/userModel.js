const bcrypt = require("bcrypt");

const users = [];

async function createUser({ username, password }) {
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

  return user;
}

function findByUsername(username) {
  return users.find((user) => user.username === username);
}

function findById(id) {
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