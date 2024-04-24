const Courses = require("../Models/course_listing.js");
const Admin = require("../Models/admin.js");

module.exports.index = async (req, res) => {
  const allCourses = await Courses.find({});
  const admin = await Admin.findOne();
  res.render("dashboard.ejs", { allCourses, admin }); //! HERE
};

module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

module.exports.CreateCourse = async (req, res) => {
  try {
    // Create a new course
    const newCourse = new Courses(req.body.courses);
    let savedCourse = await newCourse.save();

    // Retrieve the Admin document
    let admin = await Admin.findOne();

    // Update the Admin's courses array
    admin.courses.push(savedCourse._id);

    // Save the updated Admin document
    await admin.save();

    res.redirect("/admin");
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const Course = await Courses.findById(id);
  res.render("edit.ejs", { Course });
};

module.exports.UpdateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body.Course;
    // Find the course by ID
    const existingCourse = await Courses.findById(id);
    if (!existingCourse) {
      console.error("Course not found");
      return res.status(404).send("Course not found");
    }
    // Update the course with the new fields
    const updatedCourse = await Courses.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    console.log("Updated course:", updatedCourse);
    res.redirect("/admin"); // Redirect to the course listing page
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).send("Error updating course");
  }
};

module.exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the course
    let deletedCourse = await Courses.findByIdAndDelete(id);

    // Find the Admin document
    let admin = await Admin.findOne();

    // Remove the deleted course's ObjectId from the Admin's courses array
    admin.courses = admin.courses.filter(courseId => courseId.toString() !== id);

    // Save the updated Admin document
    await admin.save();

    res.redirect("/admin/mycourses");
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};