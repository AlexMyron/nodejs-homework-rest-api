const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const current = require('./current');
const updateAvatar = require('./updateAvatar');

const veryfyEmail = require('./verifyEmal');

module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
  veryfyEmail,
};
