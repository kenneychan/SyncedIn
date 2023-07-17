const User = require("../models/user");
const Job = require("../models/job");
const skillsMatching = require("./utils/skillsMatching");
const openai = require("./utils/openai");

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
  delete: deleteProfile,
};

async function updateProfile(req, res) {
  const user = await User.findById(req.user._id);
  const about = req.body.about;
  const skills = req.body.skills;
  const role = req.body.role;

  if (!user.seeker) {
    user.seeker = {};
  }

  if (about) {
    user.about = about;
  }

  if (skills) {
    user.seeker.skills = skills;
  }

  if (role) {
    if (role === "seeker") {
      user.roleSeeker = true;
      user.rolePoster = false;
    } else if (role === "poster") {
      user.roleSeeker = false;
      user.rolePoster = true;
    }
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
  const job = await Job.findById(req.params.job_id);

  const jobSkills = job.skills;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.redirect("/users");
  } else {
    const heatmap = skillsMatching.match(req.user.seeker.skills, job.skills);
    heatmap.map((skill) => {
      skill.closeness = Math.ceil(100 * skill.closeness);
    });
    // console.log("req.openai **", req.openai);
    const prompt = `From 1 to 100, how closely do these job seeker skills '${user.seeker.skills}' match these job skills '${job.skills}'`;
    console.log("prompt", prompt);
    const chatGPTResponse = await openai.chatGPT(req.openai, prompt);
    // console.log("chatGPTResponse", chatGPTResponse);
    res.render("users/showByJob", {
      title: "User Details by Job",
      heatmap,
      job,
      user,
      chatGPTResponse,
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

async function deleteProfile(req, res) {
  try {
    await User.findByIdAndDelete(req.user._id);
    // Clear the session and remove the user from the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
    });
    res.redirect("/"); // Redirect to the logout page
  } catch (error) {
    // Handle the error appropriately
    console.error("Error deleting user:", error);
    res.redirect("/users/profile"); // Redirect back to the profile page or show an error page
  }
}
