const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  username: {
    type: String,
  },
  password: String,
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
