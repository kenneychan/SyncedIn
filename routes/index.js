var express = require("express");
var router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "SyncedIn" });
});

// Google OAuth login route
router.get(
  "/auth/google",
  passport.authenticate(
    // Which passport strategy is being used?
    "google",
    {
      // Requesting the user's profile and email
      scope: ["profile", "email"],
      // Optionally force pick account every time
      prompt: "select_account",
    }
  )
);

// Google OAuth callback route
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/",
    // Change to what's best for YOUR app
    failureRedirect: "/",
  })
);

// OAuth logout route
router.get("/logout", function (req, res) {
  req.logout(function () {
    // Change path for your landing page
    res.redirect("/");
  });
});

module.exports = router;
