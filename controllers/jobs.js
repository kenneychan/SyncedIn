const Job = require("../models/job");
const skillsMatching = require("./utils/skillsMatching");

module.exports = {
  index,
  new: newJob,
  create,
  show,
  delete: deleteJob,
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
  }
  res.render("jobs/index", { title: "All Jobs", jobs });
}

function newJob(req, res) {
  res.render("jobs/new", { title: "Add New Job", errorMsg: " " });
}

async function create(req, res) {
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

async function deleteJob(req, res) {
  const jobId = req.params.id; // Get the job ID from the request parameters
  const deletedJob = await Job.findByIdAndRemove(jobId);

  if (!deletedJob) {
    // Job not found
    return res.status(404).json({ message: "Job not found" });
  }
  res.redirect("/jobs");
}
