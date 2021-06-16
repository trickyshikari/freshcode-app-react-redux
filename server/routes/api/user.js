const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const auth = require('../auth');

router.get('/:id', auth.required, (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found!'
        });
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put('/', auth.required, (req, res, next) => {
  User.findById(req.body.id)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found!'
        });
      }

      // only update fields that were actually passed...
      if (typeof req.body.user.email !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.password !== 'undefined') {
        user.setPassword(req.body.user.password);
      }

      return user.save().then(() => {
        return res.json({
          success: true,
          user: user.toAuthJSON()
        });
      });
    })
    .catch(next);
});

router.post('/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json(user.toAuthJSON());
    } else {
      let errorStr = '';

      for (const [key, value] of Object.entries(info.errors)) {
        errorStr += key + ' ' + value + '. ';
      }

      return res.status(401).json({ error: errorStr });
    }
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout();
  return res.sendStatus(200);
});

router.post('/register', (req, res, next) => {
  User.find({ email: req.body.user.email })
    .then((existingUser) => {
      if (existingUser.length === 0) {
        let user = new User();
        user.email = req.body.user.email;
        user.setPassword(req.body.user.password);
        user.save().then(() => {
          return res.json(user.toAuthJSON());
        });
      } else {
        return res.status(401).json({ error: 'User already registered!' });
      }
    })
    .catch(next);
});

module.exports = router;
