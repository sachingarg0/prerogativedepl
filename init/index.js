const mongoose=require('moongose');
const Course_Data=require('../Data/Courses.js');
const Course_Listing=require('../Models/course_listing.js');

mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!'));

