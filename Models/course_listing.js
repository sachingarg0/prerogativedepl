const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  details:{
    type:String,
  },
  description:{
    type:String,
  },
  price: {
    type: Number,
    required: true,
  },
  discounted_price: {
    type: Number,
    required: true,
  },
});

const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;
