const Order = require("../models/order.model");
const ErrorHandler = require("../utils/errorHandler");
const Product = require("../models/product.model");
const User = require("../models/user.model");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User is not logged in", 400));
    }

    const { cartWithIDandQty, shippingAddress, paidPrice, paymentInfo } =
      req.body;

    if (!cartWithIDandQty || !shippingAddress || !paidPrice || !paymentInfo) {
      return next(new ErrorHandler("Bad request", 400));
    }

    const productIds = cartWithIDandQty.map((product) => product.productId);

    const cartProducts = await Product.find({ _id: { $in: productIds } });

    const shopItemsMap = new Map();

    for (const product of cartProducts) {
      const shopId = product.shop.toString();
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }

      console.log(product);

      const transformed = {
        product: product._id.toString(),
        quantity:
          cartWithIDandQty?.find(
            (item) => item.productId === product._id.toString()
          )?.productQuantity || 0,
      };
      shopItemsMap.get(shopId).push(transformed);
      console.log(transformed);
    }
    const orders = [];

    for (const [shopId, products] of shopItemsMap) {
      const order = await Order.create({
        cart: products,
        shippingAddress,
        user: userId,
        totalPrice: paidPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("cart.product").populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};