const mongoose = require("mongoose");
const Course_Data = require("./Courses.js");
const Coupons_data = require("./Coupons.js");
const Courses = require("../Models/course_listing.js");
const Coupons = require("../Models/Coupon.js");
const Student = require("../Models/Student.js");
const Admin = require("../Models/admin.js");
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});

const MONGO_URL = process.env.MONGOURL;
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDb();
    await initCoupon();
    await initAdmin();
  } catch (error) {
    console.error("Error:", error);
  }
}

const initDb = async () => {
  try {
    await Courses.deleteMany({});
    const newData = Course_Data.course_data.map((obj) => ({ ...obj }));
    await Courses.insertMany(newData);
    console.log("Courses data initialized");
  } catch (error) {
    console.error("Error initializing Courses data:", error);
  }
};

const initCoupon = async () => {
  try {
    await Coupons.deleteMany({});
    const newCoupons = Coupons_data.coupons_data.map((obj) => ({ ...obj }));
    await Coupons.insertMany(newCoupons);
    console.log("Coupons data initialized");
  } catch (error) {
    console.error("Error initializing Coupons data:", error);
  }
};

const initAdmin = async () => {
  try {
    await Admin.deleteOne();
    const existingCourses = await Courses.find();
    const existingCoupons = await Coupons.find();
    const existingStudents = await Student.find();

    const admin = new Admin({
      courses: existingCourses.map((course) => course._id),
      coupons: existingCoupons.map((coupon) => coupon._id),
      students: existingStudents.map((student) => student._id),
    });

    const savedAdmin = await admin.save();
    console.log("Admin initialized with courses:", existingCourses.length);
  } catch (error) {
    console.error("Error initializing Admin:", error);
  }
};

main();
