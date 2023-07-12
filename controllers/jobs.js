var Job = require("../models/job");

module.exports = {
  index,
  new: newJob,
  create,
  show,
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
  try{
     const job = await Job.findById(req.params.id);
     res.render('jobs/show', {job});
    
  } catch(err) {
    console.log(err);
    res.render('error', {message: err.message, error: err});
  }
}
