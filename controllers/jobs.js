
var Job = require('../models/job');

module.exports = {
    index, 
    new: newJob,

    create
};

async function index(req, res) {
    const jobs = await Job.find({});
    res.render('jobs/index', { title: 'All Jobs', jobs });
  }

  function newJob(req, res) {
    res.render('jobs/new', {title: 'Add New Job', errorMsg: ' '});
  }
  
  async function create(req, res){
    await Job.create(req.body);
    res.redirect('/jobs');

}