const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejsmate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const CourseRouter = require("./Routes/Courses.js");
const clientRouter = require("./Routes/Client.js");
const CouponRouter=require('./Routes/Coupons.js');
const { DateTime } = require("luxon");
const flash = require("connect-flash");
const Coupons = require("./Models/Coupon.js");
const Courses = require("./Models/course_listing.js");
const { coupons_data } = require("./Data/Coupons.js");
const User = require("./Models/User.js");
const Student = require("./Models/Student.js");
const Admin = require("./Models/admin.js");
const passport = require("passport");
const dotenv=require('dotenv');


const {
  initializingPassport,
  isAuthenticated,
} = require("./passportConfig.js");
const expressSession = require("express-session");

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser());
dotenv.config({path:'./config.env'});
const MONGO_URL = process.env.MONGOURL;

main()
  .then(() => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL)
}

//! Passport
initializingPassport(passport);
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/admin", isAuthenticated, CourseRouter);
app.use("/", clientRouter);
app.use("/admin",CouponRouter);

// app.get("/register", async (req, res) => {
//   res.render("register");
// });

app.get("/login", async (req, res) => {
  res.render("login");
});

// Set up middleware to make req.user available across routes

//! For User SignUp


app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/admin",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});


app.get("/admin/dash", async (req, res) => {
  const admin = await Admin.findOne();
  res.render("dashboard.ejs", { admin });
});

app.get("/admin/profile", (req, res) => {
  res.render("profile.ejs");
});

app.get("/admin/mycourses", async (req, res) => {
  let allCourses = await Courses.find({});
  res.render("mycourses.ejs", { allCourses });
});

// ***** Manage Admins *********
app.get("/admin/adminusers", async (req, res) => {
  const users = await User.find({ role: "admin" });
  res.render("adminusers.ejs", { users });
});

app.get("/admin/createadmin", (req, res) => {
  res.render("createadmin.ejs");
});

app.get("/admin/mystudents", async (req, res) => {
  try {
    // Find the admin document and populate the students field
    const admin = await Admin.findOne({}); // Assuming you want to find the first admin document
    await admin.populate("students");

    const allStudents = admin.students.map((student) => {
      return {
        name: student.name,
        email: student.email,
        year: student.year,
        coursename: student.coursename,
        createdAt: student.createdAt,
        mobile: student.mobile,
        // Add other fields you want to extract from the student object
      };
    });

    // Render the EJS file and pass the student information as a local variable
    res.render("mystudents.ejs", { allStudents });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Client Side Rendering
app.get("/:id/details", async (req, res) => {
  let { id } = req.params;
  const Course = await Courses.findById(id);
  const discountedPrice = Course.discounted_price;
  let couponName = NaN;
  res.render("Client_next.ejs", { Course, discountedPrice, couponName });
});

app.post("/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const Course = await Courses.findById(id);
    const couponName = req.body.Coupon;
    const checkcoup = await Coupons.findOne({ Name: couponName });

    if (couponName) {
      if (checkcoup) {
        if (checkcoup.coupon_valid_from > Date.now()) {
          req.flash("error", "Your Coupon can not be accessed");
          return res.redirect(`/${id}/details`);
        }
        if (checkcoup.Coupon_qty <= 0) {
          req.flash("error", "Your Coupon has been exhausted");
          return res.redirect(`/${id}/details`);
        }

        const expiryDate = DateTime.fromJSDate(checkcoup.coupon_valid);
        const today = DateTime.now();

        if (expiryDate <= today) {
          req.flash("error", "Coupon has Expired");
          return res.redirect(`/${id}/details`);
        }

        if (!checkcoup.course.includes(id)) {
          req.flash("error", "Your Coupon is not Associated With this Course");
          return res.redirect(`/${id}/details`);
        }
      }

      const Coupon = await Coupons.findOne({ Name: couponName });
      if (!Coupon) {
        req.flash("error", "Invalid Coupon Name");
        return res.redirect(`/${id}/details`);
      }

      const discountedPrice =
        (1 - Coupon.Discount / 100) * Course.discounted_price;

      res.cookie("coupon", couponName, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("discountedPrice", discountedPrice, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.render("Client_next.ejs", {
        Course,
        discountedPrice, // Pass discountedPrice
        couponName,
        error: null, // Pass null for error
      });
    } else {
      const discountedPrice = Course.discounted_price;

      res.cookie("coupon", couponName, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("discountedPrice", discountedPrice, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.render("Client_next.ejs", {
        Course,
        discountedPrice, // Pass discountedPrice
        couponName,
        error: null, // Pass null for error
      });
    }
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:id/details/payment", (req, res) => {
  res.render("checkout.ejs");
});

app.post("/:id/details/payment", async (req, res) => {
  try {
    // Create a new student
    const student = new Student(req.body.Student);
    const savedStudent = await student.save();

    // Retrieve the coupon name from the cookie
    const couponName = req.cookies.coupon;
    const discountedPrice = req.cookies.discountedPrice;

    // Find and decrement the coupon quantity
    const updatedCoupon = await Coupons.findOneAndUpdate(
      { Name: couponName },
      { $inc: { Coupon_qty: -1 } }, // Decrement the count by 1
      { new: true } // Return the updated document
    );

    // Update admin earnings
    const updatedAdmin = await Admin.findOneAndUpdate(
      {},
      { $inc: { earnings: discountedPrice }, $push: { students: savedStudent._id } }, // Push the student's ID to the students array
      { new: true }
    );

    // Render checkout page
    res.render("checkout.ejs");
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(3000, () => {
  console.log("App is listening to port");
});
