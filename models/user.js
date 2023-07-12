const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SeekerSchema = require("./seeker");
const EmployerSchema = require("./employer");

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
      type: SeekerSchema,
    },
    employer: {
      type: EmployerSchema,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
