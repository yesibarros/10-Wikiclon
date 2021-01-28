const express = require('express');
const router = express.Router();

const { Page, User } = require('../models');

// /users
router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => {
        return res.render('users', { users });
    })
    .catch(next);
});

// /users/5
router.get('/:userId', (req, res, next) => {
  const userPromise = User.findByPk(req.params.userId);

  // Find all pages from that user
  const pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  Promise.all([userPromise, pagesPromise])
    .then(values => {
      const user = values[0];
      const pages = values[1];
      return res.render('user', {user:user, pages:pages});
    })
    .catch(next);
});

module.exports = router;
