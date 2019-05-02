const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("userdetail", userDetailsSchema, "userdetails");
