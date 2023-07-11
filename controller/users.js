const User = require("../models/user");

module.exports = {
  index,
  update,
};

async function index(req, res) {
  res.render("users/index", {
    title: "Users",
    users: await User.find(),
  });
}

async function update(req, res) {
  console.log("in user controller", req.params.id);
  console.log("req.body", req.body);
  const user = await User.findById(req.params.id);
  console.log("user", user);
  user.roleSeeker = !!req.body.roleSeeker;
  user.rolePoster = !!req.body.rolePoster;
  user.roleAdmin = !!req.body.roleAdmin;
  // Remove empty properties so that defaults will be applied
  for (let key in user) {
    if (user[key] === "") delete req.body[key];
  }
  console.log("user", user);
  await user.save();
  res.redirect("/users");
}
