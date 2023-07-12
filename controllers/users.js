const User = require("../models/user");

module.exports = {
  showUserProfile,
};

async function showUserProfile(req, res) {
  const user = await User.findById(req.user._id);
  res.render("users/profile", {
    title: "User Profile",
    user,
  });
}
