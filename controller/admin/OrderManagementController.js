const logger = require("../../config/logger");
const Order = require("../../models/order");

const getAllOrders = async (req, res) => {
  logger.info("getAllOrders Route hit...");

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status; // e.g., 'Delivered'
    const sortBy = req.query.sort || 'desc'; // 'asc' or 'desc'
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // 🔍 Build filter
    const filter = {};
    if (status) filter.orderStatus = status;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🔄 Fetch orders
    const allOrders = await Order.find(filter)
      .populate('user', 'name email') // ✅ Get user info
      .sort({ createdAt: sortBy === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    if (allOrders.length === 0) {
      logger.warn("No orders found");
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    logger.info("All orders fetched successfully");

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      count: allOrders.length,
      orders: allOrders,
    });
  } catch (error) {
    logger.error("Internal server error in getAllOrders", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getOrderById = async(req,res)=>{
      logger.info("getAllOrders Route hit...");
      try {
        const orderId=req.params.id;

        const order = await Order.findById(orderId);

        if(!order){
            logger.warn("Invalid order id")
            return res.status(400).json({
                success:false,
                message:"invalid order"
            })
        }
        res.status(200).json({
            success:true,
            order:order
        })
      } catch (error) {
        logger.error("Internal server error in getAllOrders", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
      }
}

const updateOrderStatus = async (req, res) => {
  logger.info("updateOrderStatus route hit...");

  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

    
    if (!status || !validStatuses.includes(status)) {
      logger.warn(`Invalid or missing status: ${status}`);
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

  
    const order = await Order.findById(orderId);
    if (!order) {
      logger.warn("Order not found");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered" || order.isCancelled) {
      logger.warn("Cannot update status of a completed or cancelled order");
      return res.status(400).json({
        success: false,
        message: "Cannot update status of a delivered or cancelled order",
      });
    }

  
    order.orderStatus = status;
    await order.save();

    logger.info(`Order status updated to ${status}`);
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    logger.error("Error updating order status", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports ={
    getAllOrders,
    getOrderById,
    updateOrderStatus
}