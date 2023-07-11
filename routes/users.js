var express = require("express");
var router = express.Router();

// create controller module
const usersCtrl = require("../controller/users");

/* GET users listing. */
router.get("/", usersCtrl.index);

router.post("/:id", usersCtrl.update);

module.exports = router;
