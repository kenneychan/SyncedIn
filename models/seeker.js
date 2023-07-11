const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seekerSchema = new Schema(
  {
    skills: String,
    locations: String,
    region: String,
    availability: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seeker", seekerSchema);
