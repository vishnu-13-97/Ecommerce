const logger = require("../../config/logger");
const Address = require("../../models/address");
const Cart = require("../../models/cart");
const Order = require("../../models/order");
const Product = require("../../models/products");
const razorpay= require('../../config/razorpay')
const crypto = require('crypto');
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, paymentMethod, buyNow, productId, quantity } = req.body;

    const shippingAddress = await Address.findOne({ _id: addressId, user: userId });
    if (!shippingAddress) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    let totalAmount = 0;
    let orderItems = [];
    let cartToClear = null;

    // ── BUY NOW FLOW ──
    if (buyNow && productId) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const qty = quantity || 1;
      if (product.stock < qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      totalAmount = product.price * qty;
      orderItems = [{ product: product._id, price: product.price, quantity: qty }];

      // ── CART FLOW ──
    } else {
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      for (const item of cart.items) {
        const product = item.product;
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
        totalAmount += product.price * item.quantity;
        orderItems.push({ product: product._id, price: product.price, quantity: item.quantity });
      }

      cartToClear = cart;
    }

    // ── COD ──
    if (paymentMethod === "COD") {
      // Deduct stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress: addressId,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        totalPrice: totalAmount,
      });

      // Clear cart only for normal cart orders
      if (cartToClear) {
        cartToClear.items = [];
        await cartToClear.save();
      }

      return res.status(201).json({ success: true, order });
    }

    // ── RAZORPAY ──
    if (paymentMethod === "Razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      return res.status(200).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        // Pass these along so verifyPayment can use them
        orderItems,
        totalAmount,
        addressId,
        buyNow: !!buyNow,
      });
    }

  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // 🔐 1️⃣ VERIFY SIGNATURE
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 🛒 2️⃣ GET CART AGAIN (Never trust frontend)
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 📍 3️⃣ VERIFY ADDRESS
    const shippingAddress = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!shippingAddress) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 📦 4️⃣ CHECK STOCK + CALCULATE TOTAL
    for (const item of cart.items) {
      const product = item.product;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 📉 5️⃣ REDUCE STOCK
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // 🧾 6️⃣ CREATE FINAL ORDER
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: addressId,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      totalPrice: totalAmount,
      orderStatus: "Processing",
    });

    // 🗑 7️⃣ CLEAR CART
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Payment verified & order created",
      order,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; 
    const sortBy = req.query.sort || 'desc'; 
    const startDate = req.query.startDate; 
    const endDate = req.query.endDate; 

    // ✅ Build filter
    const filter = { user: userId };

    if (status) {
      filter.orderStatus = status;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // ✅ Pagination
    const skip = (page - 1) * limit;

    // ✅ Fetch orders
    const orders = await Order.find(filter)
      .sort({ createdAt: sortBy === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product');

    // ✅ Get total count for pagination info
    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




const cancelOrder  = async (req,res)=>{
  logger.info("cancelOrder routes hit...");
  try {
    const orderId = req.params.id;
    console.log(orderId);
    
const orders = await Order.findById(orderId);

    if(!orders){
      logger.warn("Error in fetching order");
      return res.status(404).json({
        success:false,
        message:"Error in fetching order"
      })
    }
    if(orders.orderStatus==="Delivered"){
      logger.warn("Order Already Delivered Cannot cancel order");
      return res.status(400).json({
        success:false,
        message:"cannot cancel order "
      })
    }
  if (orders.isCancelled) {
      logger.warn("Order already cancelled");
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    for (const item of orders.items) {
  const updateResult = await Product.updateOne(
    { _id: item.product },
    { $inc: { stock: item.quantity } } 
  );

  if (updateResult.matchedCount === 0) {
    logger.warn(`Product not found for item ${item.product}`);
  }
}

    orders.orderStatus = "Cancelled";
    orders.isCancelled = true;
    await orders.save();

logger.info('Order cancelled successfully');
res.status(200).json({
  cancelledOrder:orders,
  success:true,
  message:"order cancelled successfully"
  
})
    
  } catch (error) {
    logger.warn("internal server error");
    res.status(500).json({
      success:false,
      message:"internal server error"
    })
  }
}

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate('items.product')
    .populate('shippingAddress'); // ← populate address document

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.status(200).json({ success: true, order });
};

module.exports = {
    placeOrder,
    getMyOrders,
    cancelOrder,
    getSingleOrder,
    verifyPaymentAndCreateOrder
}