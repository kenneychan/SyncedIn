var express = require("express");
var router = express.Router();
var usersCtrl = require("../controllers/users");
var ensureLoggedIn = require("../config/ensureLoggedIn");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile", ensureLoggedIn, usersCtrl.showUserProfile);

module.exports = router;
