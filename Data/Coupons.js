const coupons = [
  {
    Name: "First Purchase Discount",
    Discount: 10,
    Coupon_qty: 100,
    coupon_valid: new Date("2024-12-31"),
  },
  {
    Name: "Summer Sale",
    Discount: 20,
    Coupon_qty: 50,
    coupon_valid: new Date("2024-08-31"),
  },
];

module.exports = { coupons_data: coupons };
