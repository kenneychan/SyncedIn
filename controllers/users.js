const User = require("../models/user");

module.exports = {
  showSeekerProfile,
};

async function showSeekerProfile(req, res) {
  const user = await User.findById(req.user._id);
  res.render("seekers/profile", {
    title: "Seeker Profile",
    user,
  });
}
