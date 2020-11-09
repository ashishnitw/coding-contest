const jwt = require('jsonwebtoken');
const Errors = require('../common/errors');

const secretKey = 'secretkey'

module.exports = {
  sign(payload) {
    return jwt.sign(payload, secretKey, { algorithm: "HS256" });
  },

  verify(token) {
    try {
      return jwt.verify(token, secretKey, { algorithm: "HS256" });
    } catch (err) {
      throw err;
    }
  },

  authenticate(req, res, next) {
    try {
      let arr = req.headers.authorization.split(" ");
      req.userData = jwt.verify(arr[1], secretKey, { algorithm: "HS256" });
      next();
    } catch (err) {
      return res.status(403).json(Errors.AccessDenied);
    }
  }
  
}
