const {
  createShop,
  shopActivation,
  shopLogin,
  getShop,
  getAllProductsOfShop,
  deleteShopSingleProduct,
  logOutShop,
  createEvent,
  getAllEventsOfShop,
  deleteShopSingleEvent,
  createcuopon,
  getShopcuopons,
  deleteSingleCoupon,
  getShopAllOrders,
  updateOrderStatus,
} = require("../controllers/shop.controller");
const { isSeller } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");
const upload = require("../upload");

const router = require("express").Router();

// create a new shop
router.post("/create-shop", upload.single("file"), createShop);

// shop activation
router.post("/activation", catchAsyncError(shopActivation));

// login shop
router.post("/login-shop", catchAsyncError(shopLogin));

// to logout shop
router.get("/logout", catchAsyncError(logOutShop));

// to retrive shop information
router.get("/get-shop", isSeller, getShop);

// create event handlers
router.post(
  "/events",
  isSeller,
  upload.array("images"),
  catchAsyncError(createEvent)
);

// get all events of shop
router.get("/:shopId/events", catchAsyncError(getAllEventsOfShop));

// delete shop single event
router.delete(
  "/:shopId/events/:eventId",
  isSeller,
  catchAsyncError(deleteShopSingleEvent)
);

// get all products of shop
router.get("/:shopId/products", catchAsyncError(getAllProductsOfShop));

// delete shop single product
router.delete(
  "/:shopId/products/:productId",
  isSeller,
  catchAsyncError(deleteShopSingleProduct)
);

// create cuopon of shop
router.post("/:shopId/coupons", isSeller, catchAsyncError(createcuopon));

// get cuopons of shops
router.get("/:shopId/coupons", isSeller, catchAsyncError(getShopcuopons));

// delete single coupon
router.delete(
  "/:shopId/coupons/:couponId",
  isSeller,
  catchAsyncError(deleteSingleCoupon)
);

// get all shop orders
router.get("/:shopId/orders/", isSeller, catchAsyncError(getShopAllOrders));

// update shop order status
router.put(
  "/:shopId/orders/:orderId",
  isSeller,
  catchAsyncError(updateOrderStatus)
);

module.exports = router;
