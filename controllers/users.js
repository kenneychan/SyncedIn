const User = require("../models/user");
const Job = require("../models/job");
const skillsMatching = require("./utils/skillsMatching");

const Seeker = require("../models/seeker");

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
  showSeekers,
  show,
  showByJob,
  updateProfile,
};

async function updateProfile(req, res) {
  const user = await User.findById(req.user._id);
  const about = req.body.about;
  const skills = req.body.skills;

  if (!user.seeker) {
    user.seeker = {};
  }

  if (about) {
    user.about = about;
  }

  if (skills) {
    user.seeker.skills = skills;
  }

  await user.save();
  res.redirect("/users/profile");
}

async function show(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.redirect("/users");
  } else {
    res.render("users/show", {
      title: "User Details",
      user,
    });
  }
}

async function showByJob(req, res) {
  console.log("params.job_id", req.params.job_id);
  const job = await Job.findById(req.params.job_id);

  const jobSkills = job.skills;
  console.log("jobSkills", jobSkills);

  const user = await User.findById(req.params.id);
  if (!user) {
    res.redirect("/users");
  } else {
    console.log("userSkills", req.user.seeker.skills);
    const heatmap = skillsMatching.match(req.user.seeker.skills, job.skills);
    heatmap.map((skill) => {
      skill.closeness = Math.ceil(100 * skill.closeness);
    });
    console.log("heatmap", heatmap);
    res.render("users/showByJob", {
      title: "User Details by Job",
      heatmap,
      job,
      user,
    });
  }
}

async function showSeekers(req, res) {
  const users = await User.find({
    roleSeeker: true,
  });
  res.render("users/seekers", {
    title: "Seekers",
    users,
  });
}

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
