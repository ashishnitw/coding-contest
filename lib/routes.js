const express = require('express');
const router = express.Router();
const userRoutes = require('./user/user-routes');

router.use(userRoutes);

module.exports = router;