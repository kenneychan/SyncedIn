const job = require("../models/job");
var Job = require("../models/job");

module.exports = {
  index,
  new: newJob,
  create,
  show,
  delete: deleteJob,
  update,
  edit,
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

async function update(req, res) {
  const jobId = req.params.id; // Get the job ID from the request parameters
  try {
    const updateJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title: req.body.title,
        description: req.body.description,
        skills: req.body.skills,
        location: req.body.location,
        startDate: req.body.startDate,
        wage: req.body.wage,
      },
      { new: true }
    );

    if (!updateJob) {
      // Job not found
      return res.status(404).json({ message: "Job not found" });
    }

    res.redirect("/jobs");
  } catch (error) {
    // Handle any errors that occurred during the update process
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function edit(req, res) {
  try {
    const jobId = req.params.id; // Get the job ID from the request parameters
    // Fetch the job from the database based on the job ID
    const job = await Job.findById(jobId);

    if (!job) {
      // Job not found
      return res.status(404).json({ message: "Job not found" });
    }

    res.render("jobs/edit", { title: "Edit Page", job });
  } catch (error) {
    // Handle any errors that occurred during the fetching process
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// function update(req, res) {
//   req.body.done = !!req.body.done;
//   Todo.update(req.params.id, req.body);
//   res.redirect(`/todos/${req.params.id}`);
// }

// function edit(req, res) {
//   const todo = Todo.getOne(req.params.id);
//   res.render('todos/edit', { // Removed the leading slash (/) from the template path
//     title: 'Edit to-do',
//     todo
//   });
// }
