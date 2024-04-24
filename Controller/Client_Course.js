const Courses=require('../Models/course_listing.js');

module.exports.index=async (req,res)=>{
    const allCourses=await Courses.find({});
    res.render("client.ejs",{allCourses});
}

