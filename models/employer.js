const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerSchema = new Schema(
  {
    name: String,
    region: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employer", employerSchema);
