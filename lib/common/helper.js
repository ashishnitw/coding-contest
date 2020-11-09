const crypto = require('crypto');

module.exports = {
  replySuccess(res, data) {
    return res.status(200).json(data);
  },

  replyError(res, error) {
    let statusCode = error.statusCode || 500;
    return res.status(statusCode).json(error);
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  isValidPassword(password) {
    return password.length >= 8;
  },

  setPasswordHash(user, password) {
    user.salt = crypto.randomBytes(16).toString('hex');   //Creating a unique salt for a particular user
    user.password = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`); //hash password using salt
  },
  
  validatePassword(user, password) {
    let hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`);
    return hash === user.password;
  },

}