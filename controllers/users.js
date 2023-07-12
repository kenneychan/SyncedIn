const User = require("../models/user");

const ROLE = {
  ADMIN: "roleAdmin",
  SEEKER: "roleSeeker",
  POSTER: "rolePoster",
};

module.exports = {
  ROLE,
  showUserProfile,
  index,
  update,
};

async function showUserProfile(req, res) {
  const user = await User.findById(req.user._id);
  res.render("users/profile", {
    title: "User Profile",
    user,
  });
}

async function index(req, res) {
  res.render("users/index", {
    title: "Users",
    users: await User.find(),
  });
}

async function update(req, res) {
  const user = await User.findById(req.params.id);
  user.roleSeeker = !!req.body.roleSeeker;
  user.rolePoster = !!req.body.rolePoster;
  user.roleAdmin = !!req.body.roleAdmin;
  // Remove empty properties so that defaults will be applied
  for (let key in user) {
    if (user[key] === "") delete req.body[key];
  }
  await user.save();
  res.redirect("/users");
}
