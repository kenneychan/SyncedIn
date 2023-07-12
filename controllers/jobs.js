var Job = require("../models/job");

module.exports = {
  index,
  new: newJob,
  create,
  show,
  delete: deleteJob,
};

async function index(req, res) {
  const jobs = await Job.find({});
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
