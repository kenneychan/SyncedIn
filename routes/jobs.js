var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('../config/ensureLoggedIn');
var syncCtrl = require('../controllers/jobs');

/* GET users listing. */
router.get('/jobs', function(req, res, next) {
  res.send('respond with a resource');
});

// create job posting
router.post('/jobs/new.ejs', ensureLoggedIn, syncCtrl.create);
router.get('/', ensureLoggedIn, syncCtrl.index);




module.exports = router;
