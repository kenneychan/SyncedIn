var Job = require('../models/user');

module.exports = {
    index, 
    create
};

async function index(req, res) {
    const jobs = await Job.find({});
    res.render('jobs/index', { title: 'All Jobs', jobs });
  }
  
  async function create(req, res){
    await Job.create(req.body);
    res.redirect('jobs/index.ejs');
}