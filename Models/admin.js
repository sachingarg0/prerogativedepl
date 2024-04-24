const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  coupons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  earnings: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
