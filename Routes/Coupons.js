const express=require('express');
const router=express.Router();
const couponController=require('../Controller/CouponController.js');

router.get("/Coupons", couponController.index);

router.get("/Coupons/:id", couponController.showCoupon);
  
router.get("/createCoupon", couponController.renderNewForm);
  
router.post("/createCoupon", couponController.createCoupon);
  
router.get("/Coupons/:id/edit", couponController.renderEditForm);
  
router.put("/Coupons/:id/edit", couponController.updateCoupon);
  
router.delete("/Coupons/:id", couponController.deleteCoupon);

module.exports=router