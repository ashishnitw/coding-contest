const _ = require('lodash'),
  Errors = require('../common/errors'),
  JwtAuth = require('../common/jwt-auth');
const Helper = require('../common/helper');
const pool = require('../../db');

module.exports = {
  async findByEmail(email) {
    const users = await pool.query("SELECT * FROM users where email = ($1)", [email]);
    return users;
  },

  async findById(id) {
    const users = await pool.query("SELECT * FROM users where id = ($1)", [id]);
    return users;
  },

  async signup(payload) {
    try {
      const { email, password } = payload;
      if (_.isEmpty(payload) || _.isEmpty(email) || _.isEmpty(password))
        throw Errors.MissingRequiredFields;
      if (!Helper.isValidPassword(password)) throw Errors.ValidationErrorPassword;
      if (!Helper.isValidEmail(email)) throw Errors.ValidationErrorEmail;
      let result = await this.findByEmail(email)
      if (result.rowCount > 0)
        throw Errors.UserAlreadyRegistered;
      const user = { email: payload.email };
      Helper.setPasswordHash(user, payload.password); // hashing password
      result = await pool.query("INSERT INTO users (email, password, salt, created_at) VALUES ($1, $2, $3, $4) RETURNING *", [user.email, user.password, user.salt, new Date()]);
      return { id: result.rows[0].id, email: email, created_at: result.rows[0].created_at, updated_at: null };
    } catch (err) {
      throw err;
    }
  },

  async login(payload) {
    try {
      if (_.isEmpty(payload) || _.isEmpty(payload.email) || _.isEmpty(payload.password))
        throw Errors.MissingRequiredFields;
      let result = await this.findByEmail(payload.email)
      if (result.rowCount == 0)
        throw Errors.UserNotExist;
      if (!Helper.validatePassword(result.rows[0], payload.password))
        throw Errors.Unauthorized;
      let token = JwtAuth.sign({ email: payload.email });
      result = await pool.query("UPDATE users SET token = $1 WHERE id = $2 RETURNING *", [token, result.rows[0].id]);
      return { token };
    } catch (err) {
      throw err;
    }
  },

  async secret(userData) {
    try {
      const result = await this.findByEmail(userData.email);
      return { id: result.rows[0].id, secret: "All your base are belong to us" };
    } catch (err) {
      throw Errors.TokenInvalid;
    }
  },

  async update(id, payload, userData) {
    try {
      let result = await this.findById(id);
      if (result.rowCount == 0)
        throw Errors.UserNotExist;
      if(!_.isEqual(result.rows[0].email, userData.email))
        throw Errors.AccessDenied;
      let user = result.rows[0];
      if(!_.isEmpty(payload.email))
        user.email = payload.email;
      if (!Helper.isValidPassword(payload.password)) throw Errors.ValidationErrorPassword;
      if (!Helper.isValidEmail(payload.email)) throw Errors.ValidationErrorEmail;
      if(!_.isEmpty(payload.password))
        Helper.setPasswordHash(user, payload.password); // hashing password
      result = await pool.query("UPDATE users SET email = $1, password = $2, salt = $3, updated_at = $4 WHERE id = $5 RETURNING *", [user.email, user.password, user.salt, new Date(), id]);
      return {id: result.rows[0].id, email: user.email, created_at: result.rows[0].created_at, updated_at: result.rows[0].updated_at};
    } catch (err) {
      throw err;
    }
  },
}