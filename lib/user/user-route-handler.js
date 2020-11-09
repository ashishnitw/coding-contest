const Helper = require('../common/helper');
const Controller = require('./user-controller');
const { update } = require('lodash');

module.exports = {
  async signup(req, res) {
    try {
      let result = await Controller.signup(req.body);
      return Helper.replySuccess(res, result);
    } catch (err) { return Helper.replyError(res, err); }
  },

  async login(req, res) {
    try {
      let result = await Controller.login(req.body);
      return Helper.replySuccess(res, result);
    } catch (err) { return Helper.replyError(res, err); }
  },

  async secret(req, res) {
    try {
      let result = await Controller.secret(req.userData);
      return Helper.replySuccess(res, result);
    } catch (err) { return Helper.replyError(res, err); }
  },

  async logout(req, res) {
    try {
      let result = await Controller.logout();
      return Helper.replySuccess(res, result);
    } catch (err) { return Helper.replyError(res, err); }
  },

  async update(req, res) {
    try {
      let result = await Controller.update(req.params.id, req.body, req.userData);
      return Helper.replySuccess(res, result);
    } catch (err) { return Helper.replyError(res, err); }
  },
}