const logger = require("../../config/logger");
const Address = require("../../models/address");
const Order = require("../../models/order");
const Product = require("../../models/products");


const placeOrder = async (req,res)=>{
    logger.info("placeOrder Route hit...");
   
    try {
        const userId = req.user.id;
        const {items,addressId,paymentMethod}=req.body;

        if(!items|| items.length ===0){
            logger.warn("Cart is empty")
            return res.status(400).json({
                message:'cart is empty'
            })
        }

         const shippingAddress = await Address.findOne({ _id: addressId, user: userId }).lean();
    if (!shippingAddress) {
        logger.warn("shipping address not found")
      return res.status(404).json({ message: 'Shipping address not found' });
    }
          let totalAmount = 0;
    const orderItems = [];


 for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        logger.warn("Product not found")
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        logger.warn("Not enough stock")
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      // 2. Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // 3. Create Order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: addressId,
      paymentMethod,
      totalPrice:totalAmount,
      orderStatus: 'Processing', 
    });

    const savedOrder = await order.save();
    logger.info("Order placed successfully")

    res.status(201).json({ message: 'Order placed successfully', 

     });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Something went wrong while placing the order' });
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

  const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.status(200).json({ success: true, order });
};


module.exports = {
    placeOrder,
    getMyOrders,
    cancelOrder,
    getSingleOrder
}