const express = require('express');
const router = express.Router();
const Handler = require('./user-route-handler');
const { authenticate } = require('../common/jwt-auth');

router.post('/users', Handler.signup)
router.post('/login', Handler.login)
router.get('/secret', authenticate, Handler.secret)
router.patch('/users/:id', authenticate, Handler.update)

module.exports = router;