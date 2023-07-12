const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Seeker = require("./seeker");
const Employer = require("./employer");

const userSchema = new Schema(
  {
    name: String,
    googleId: {
      type: String,
      required: true,
    },
    email: String,
    avatar: String,
    roleSeeker: Boolean,
    rolePoster: Boolean,
    roleAdmin: Boolean,
    seeker: {
      type: Schema.Types.ObjectId,
      ref: "Seeker",
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
