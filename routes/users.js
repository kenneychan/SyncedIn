var express = require("express");
var router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");
const checkUserRole = require("../config/checkUserRole");
// create controller module
const usersCtrl = require("../controllers/users");

/* GET users listing. */
router.get(
  "/",
  ensureLoggedIn,
  checkUserRole.authRole(usersCtrl.ROLE.ADMIN),
  usersCtrl.index
);

router.get("/profile", ensureLoggedIn, usersCtrl.showUserProfile);

router.put("/:id", ensureLoggedIn, usersCtrl.update);

module.exports = router;
