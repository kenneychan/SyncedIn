const Job = require("../models/job");
const User = require("../models/user");

module.exports = {
  index,
};

async function index(req, res) {
  const users = await User.find();
  const jobs = await Job.find();

  res.render("index", {
    title: "SyncedIn",
    users,
    jobs,
  });
}
