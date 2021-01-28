const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki');
const userRouter = require('./user');

// order matters
router.use('/user', userRouter);
router.use('/users', userRouter);
router.use('/wiki', wikiRouter);
router.use('/', wikiRouter);

module.exports = router;