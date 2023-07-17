const { use } = require("passport");
const Job = require("../models/job");
const User = require("../models/user");
const skillsMatching = require("./utils/skillsMatching");
const openai = require("./utils/openai");

module.exports = {
  index,
  new: newJob,
  create,
  show,
  delete: deleteJob,
  update,
  edit,
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
    const user = await User.findById(req.user._id);
    const job = await Job.findById(req.params.id);
    const poster = await User.findById(job.poster_id);

    let heatmap;
    let chatGPTResponse;
    if (user.seeker && user.seeker.skills && job.skills) {
      heatmap = skillsMatching.match(user.seeker.skills, job.skills);
      heatmap.map((skill) => {
        skill.closeness = Math.ceil(100 * skill.closeness);
      });

      // console.log("req.openai **", req.openai);
      const prompt = `How closely do these job seeker skills: (${user.seeker.skills}) match these job skills: (${job.skills})`;
      console.log("prompt", prompt);
      chatGPTResponse = await openai.chatGPT(req.openai, prompt);
      // console.log("chatGPTResponse", chatGPTResponse);
    }

    res.render("jobs/show", { job, heatmap, user, poster, chatGPTResponse });
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message, error: err });
  }
}

async function showByJob(req, res) {
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
        user.heatmap = heatmap = skillsMatching.matchHeatmap(
          user.seeker.skills,
          job.skills,
          TOPN
        );
        user.jobid = req.params.id;
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
    job_id: req.params.id,
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
