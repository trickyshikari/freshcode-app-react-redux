var router = require('express').Router();

router.use('/user', require('./user'));
router.use('/board', require('./board'));
router.use('/queue', require('./queue'));
router.use('/task', require('./task'));
router.use('/comment', require('./comment'));

router.use(function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
