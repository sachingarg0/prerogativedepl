const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  mobile: {
    type: String,
    default: "000000000",
  },
  email: {
    type: String,
  },
  year: {
    type: Number,
    require: true,
  },
  coursename: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
