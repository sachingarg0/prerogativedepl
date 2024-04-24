const express=require('express');
const router=express.Router();
const clientCourse=require('../Controller/Client_Course');

router.get("/",clientCourse.index);



module.exports=router;