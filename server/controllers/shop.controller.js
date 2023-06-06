const Shop = require("../models/shop.model");
const Event = require("../models/event.model");
const Cupon = require("../models/cuponcode.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const path = require("path");
const fs = require("fs");
const { sendMail } = require("../utils/sendMail");
const ErrorHandler = require("../utils/errorHandler");
const {
  createActivationToken,
  decodeActivationToken,
} = require("../helper/helper");
const { sendShopToken } = require("../utils/shopToken");

// shop creation
exports.createShop = async (req, res, next) => {
  try {
    const { email, name, password, address, zipcode, phoneNumber } = req.body;

    const alreadyShop = await Shop.findOne({ email: email });

    if (alreadyShop) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error for deleting file" });
        }
      });
      return next(new ErrorHandler("This email is already register", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const shop = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
      address: address,
      phoneNumber: phoneNumber,
      zipcode: zipcode,
    };

    const expirationTime = new Date(Date.now() + 600000);

    const activationToken = createActivationToken(shop, expirationTime);

    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: shop.email,
        subject: "Activate your shop account",
        message: `Hello ${shop.name}, please click on the link to activate your shop: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${shop.email} to activate your shop.`,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Failed to send activation email", 500));
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
};

// shop email verification or activation
exports.shopActivation = async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const decodedShop = decodeActivationToken(activation_token, res);

    if (!decodedShop) {
      return next(new ErrorHandler("Invalid shop activation token", 400));
    }

    const { name, email, password, avatar, zipcode, address, phoneNumber } =
      decodedShop;

    const alreadyShop = await Shop.findOne({ email });

    if (alreadyShop) {
      return next(new ErrorHandler("Shop already exist", 400));
    }

    const newShop = await Shop.create({
      name,
      email,
      password,
      avatar,
      zipcode,
      address,
      phoneNumber,
    });

    sendShopToken(newShop, 201, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Failed to create shop", 500));
  }
};

// shop login
exports.shopLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all the fields", 400));
    }

    const shop = await Shop.findOne({ email }).select("+password");

    if (!shop) {
      return next(new ErrorHandler("Shop doesn't exist", 404));
    }

    const isPasswordValid = await shop.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Wrong Password", 400));
    }

    sendShopToken(shop, 200, res);
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Failed to login shop", 500));
  }
};

// get shop details
exports.getShop = async (req, res, next) => {
  try {
    const sellerId = req.seller.id;
    const shop = await Shop.findById(sellerId);

    if (!shop) {
      return next(new ErrorHandler("Shop does't exist", 404));
    }

    res.status(200).json({ success: true, shop });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// get all products of a shop
exports.getAllProductsOfShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const products = await Product.find({ shop: shopId }).populate("shop");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// delete sinlge product of a shop
exports.deleteShopSingleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const productData = await Product.findById(productId);

    productData.images.forEach((image) => {
      const filepath = `uploads/${image.filename}`;

      fs.unlink(filepath, (err) => {
        if (err) {
          console.log(err);
          return next(new ErrorHandler(err.message, 500));
        }
      });
    });

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new ErrorHandler("Product does not exist", 404));
    }

    res
      .status(201)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// create shop event
exports.createEvent = async (req, res, next) => {
  try {
    const sellerId = req.seller.id;

    const shop = await Shop.findById(sellerId);

    if (!shop) {
      return next(new ErrorHandler("Invalid Seller id", 400));
    }

    const files = req.files;
    const imageUrls = files.map((file) => `${file.filename}`);

    const eventData = req.body;

    eventData.images = imageUrls;
    eventData.shop = shop._id;

    const event = await Event.create(eventData);

    res.status(201).json({ success: true, event });
  } catch (e) {
    console.error(e);
    next(new ErrorHandler(e.message, 500));
  }
};

// get shop all events
exports.getAllEventsOfShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const events = await Event.find({ shop: shopId }).populate("shop");

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// delete sinlge product of a shop
exports.deleteShopSingleEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const eventData = await Event.findById(eventId);

    eventData.images.forEach((image) => {
      const filepath = `uploads/${image}`;

      fs.unlink(filepath, (err) => {
        if (err) {
          console.log(err);
          return next(new ErrorHandler(err.message, 500));
        }
      });
    });

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return next(new ErrorHandler("Event does not exist", 404));
    }

    res
      .status(201)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// logout shop
exports.logOutShop = async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({ success: true, message: "Log out Successful!" });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// create cuopon code
exports.createcuopon = async (req, res, next) => {
  try {
    const cuoponcode = await Cupon.findOne({ name: req.body.name });

    if (cuoponcode) {
      return next(new ErrorHandler("Cupon code already exists", 400));
    }

    const obj = {
      ...req.body,
      shop: req.seller.id,
    };
    const newCuopon = await Cupon.create(obj);

    res
      .status(201)
      .json({ success: true, message: "Coupon Added Successfully" });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// get shop cupons
exports.getShopcuopons = async (req, res, next) => {
  try {
    const coupons = await Cupon.find({ shop: req.seller.id });

    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// delete single coupon
exports.deleteSingleCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;

    const sellerId = req.seller.id;

    const couponData = await Cupon.findById(couponId);

    if (couponData.shop.toString() !== sellerId) {
      return next(
        new ErrorHandler("You are not allowed to perform this action", 400)
      );
    }

    const coupon = await Cupon.findByIdAndDelete(couponId);
    res
      .status(200)
      .json({ success: true, message: "Coupon code deleted successfully" });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};

// get shop all orders
exports.getShopAllOrders = async (req, res, next) => {
  try {
    const sellerId = req.seller.id;

    const orders = await Order.find({ shop: sellerId });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
};
