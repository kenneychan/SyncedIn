// In your routes file
var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('../config/ensureLoggedIn');
var syncCtrl = require('../controllers/jobs');
var jobs = require('../models/job'); // Import the correct model file

/* GET jobs listing. */
router.get('/', syncCtrl.index);
// get new jobs
router.get('/new', syncCtrl.new);
// Create job posting
router.post('/', syncCtrl.create);
// show detials for job post
router.get('/:id', syncCtrl.show);
// delete job
router.delete('/:id', syncCtrl.delete);
module.exports = router;
