var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
  res.send('page de profile');
});

module.exports = router;
