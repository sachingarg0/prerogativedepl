const express=require('express');
const router=express.Router();
const CourseController=require('../Controller/CourseController.js')

//Rendering the listing page
router.get("/",CourseController.index);
//Rendering new form
router.get("/Create",CourseController.renderNewForm);
//Creating a new Course
router.post("/Create",CourseController.CreateCourse);
//Rendering the Edit Form 
router.get("/:id/Edit",CourseController.renderEditForm);
//Editing the course
router.put("/:id/Edit", CourseController.UpdateCourse);
//Delteing the Route
router.delete("/:id",CourseController.deleteCourse); 

module.exports=router;