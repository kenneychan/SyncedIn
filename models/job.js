const mongoose = require("mongoose");
const User = require("./user");
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  avatar: String,
  company: String,
  image: String,
  title: String,
  description: String,
  skills: String,
  location: String,
  startDate: String,
  wage: {
    type: String,
    enum: [
      "$50,000-$75,000",
      "$75,000-$100,000",
      "$100,000-$125,000",
      "$125,000-$155,000",
      "$150,000-$175,000",
      "$175,000-$200,000",
      "$200,000-$250,000+",
    ],
  },
  poster_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Job", jobSchema);
