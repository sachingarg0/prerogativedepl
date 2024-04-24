const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  Id: {
    type: String,
  },
  Name: {
    type: String,
    require: true,
  },
  Discount: {
    type: Number,
    require: true,
  },
  Coupon_qty: {
    type: Number,
    require: true,
  },
  coupon_created: {
    type: Date,
    default: Date.now(),
  },
  coupon_valid_from:{
    type:Date,
    default:Date.now()
  },
  coupon_valid: {
    type: Date,
  },
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
});

module.exports = mongoose.model("Coupon", CouponSchema);
