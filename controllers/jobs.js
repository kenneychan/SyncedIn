const { use } = require("passport");
const Job = require("../models/job");
const User = require("../models/user");
const skillsMatching = require("./utils/skillsMatching");

module.exports = {
  index,
  new: newJob,
  create,
  show,
  delete: deleteJob,
  jobsByPoster,
  seekers,
};

const TOPN = 5;

async function index(req, res) {
  const jobs = await Job.find({});
  if (req.user && req.user.seeker && req.user.seeker.skills) {
    jobs.map((job) => {
      if (job.skills) {
        job.heatmap = skillsMatching.matchHeatmap(
          req.user.seeker.skills,
          job.skills,
          TOPN
        );
      }
    });
    jobs.sort((a, b) => {
      if (a.heatmap < b.heatmap) {
        return 1;
      } else if (a.heatmap > b.heatmap) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  res.render("jobs/index", { title: "All Jobs", jobs });
}

async function jobsByPoster(req, res) {
  const jobs = await Job.find({ poster_id: req.user.id });

  res.render("jobs/jobsByPoster", { title: "My Jobs", jobs });
}

function newJob(req, res) {
  res.render("jobs/new", { title: "Add New Job", errorMsg: " " });
}

async function create(req, res) {
  req.body.poster_id = req.user._id;
  await Job.create(req.body);
  res.redirect("/jobs");
}

async function show(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    res.render("jobs/show", { job });
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }
}

async function seekers(req, res) {
  let users = await User.find({
    roleSeeker: true,
  });

  try {
    const job = await Job.findById(req.params.id);

    users.map((user) => {
      if (user.seeker && user.seeker.skills) {
        const heatmap = skillsMatching.matchHeatmap(
          user.seeker.skills,
          job.skills,
          TOPN
        );
        user.heatmap = heatmap;
        user.silly = "silly";
        user.sillynumber = 0;
      }
    });

    users.sort((a, b) => {
      a.heatmap = a.heatmap ? a.heatmap : 0;
      b.heatmap = b.heatmap ? b.heatmap : 0;

      if (a.heatmap < b.heatmap) {
        return 1;
      } else if (a.heatmap > b.heatmap) {
        return -1;
      } else {
        return 0;
      }
    });
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }

  res.render("jobs/seekers", {
    title: "Seekers by Job",
    users,
  });
}

async function deleteJob(req, res) {
  const jobId = req.params.id; // Get the job ID from the request parameters
  const deletedJob = await Job.findByIdAndRemove(jobId);

  if (!deletedJob) {
    // Job not found
    return res.status(404).json({ message: "Job not found" });
  }
  res.redi;
  rect("/jobs");
}
