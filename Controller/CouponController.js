const Coupons = require("../Models/Coupon.js");
const Admin = require("../Models/admin.js");
const Courses = require("../Models/course_listing.js");
const flash = require("connect-flash");

module.exports.index = async (req, res) => {
  let allCoupons = await Coupons.find({});
  res.render("Coupons.ejs", { allCoupons });
};

module.exports.showCoupon = async (req, res) => {
  let { id } = req.params;
  let Coupon = await Coupons.findById(id).populate("course");
  res.render("Show_Coupon.ejs", { Coupon });
};

module.exports.renderNewForm = async (req, res) => {
  let allCourses = await Courses.find({});
  res.render("Create.ejs", { allCourses });
};

module.exports.createCoupon = async (req, res) => {
  try {
    // Create a new coupon
    const newCoupon = new Coupons(req.body.Coupon);
    const checkCoupon = await Coupons.findOne({ Name: newCoupon.Name });

    if (!checkCoupon) {
      let savedCoupon = await newCoupon.save();

      // Retrieve the Admin document
      let admin = await Admin.findOne();

      // Update the Admin's coupons array
      admin.coupons.push(savedCoupon._id);

      // Save the updated Admin document
      await admin.save();

      res.redirect("/admin");
    } else {
      req.flash("error", "Your Coupon already exist");
      return res.redirect(`/admin/createCoupon`);
    }
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let allCourses = await Courses.find({});
  const Coupon = await Coupons.findById(id);
  res.render("EditCoupon.ejs", { Coupon, allCourses });
};

module.exports.updateCoupon = async (req, res) => {
  const { id } = req.params;
  const upDatedFields = req.body.Coupon;
  const UpdatedCoupon = await Coupons.findByIdAndUpdate(id, upDatedFields, {
    new: true,
  });
  res.redirect("/admin");
};

module.exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupons.findByIdAndDelete(id);

    // Find the Admin document
    let admin = await Admin.findOne();

    // Remove the deleted coupon's ObjectId from the Admin's coupons array
    admin.coupons = admin.coupons.filter(
      (couponId) => couponId.toString() !== id
    );

    // Save the updated Admin document
    await admin.save();

    res.redirect("/admin/Coupons");
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
