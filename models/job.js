const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    Title: String,
    Description: String,
    Skills: String,
    Location: String,
    StartDate: String,
    Wage: {
    type: String,
    enum: ['$50,000-$75,000', '$75,000-$100,000', '$100,000-$125,000', 
    '$125,000-$155,000', '$150,000-$175,000', '$175,000-$200,000', '$200,000-$250,000+',]
}


})

module.exports = mongoose.model('Job', jobSchema);