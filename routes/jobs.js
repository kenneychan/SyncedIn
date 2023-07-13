// In your routes file
var express = require("express");
var router = express.Router();
var ensureLoggedIn = require("../config/ensureLoggedIn");
var syncCtrl = require("../controllers/jobs");
var jobs = require("../models/job"); // Import the correct model file

/* GET jobs listing. */
router.get("/", ensureLoggedIn, syncCtrl.index);
// get new jobs
router.get("/new", ensureLoggedIn, syncCtrl.new);
// Create job posting
router.post("/", ensureLoggedIn, syncCtrl.create);
// show detials for job post
router.get("/:id", ensureLoggedIn, syncCtrl.show);
// delete job
router.delete("/:id", ensureLoggedIn, syncCtrl.delete);
router.get("/:id/edit", ensureLoggedIn, syncCtrl.edit);
// update job
router.put("/:id", ensureLoggedIn, syncCtrl.update);

module.exports = router;
