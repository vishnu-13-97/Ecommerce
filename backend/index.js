const dotenv = require('dotenv');
dotenv.config();
require('./config/redis');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const app = express();
const { swaggerUi, specs } = require("./config/swagger");
const PORT = process.env.PORT || 5000;
const logger = require('./config/logger');

const authRoute = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/userRoutes/categoryRoute');
const brandRoutes = require('./routes/userRoutes/brandRoutes');
const productRoutes = require('./routes/userRoutes/productRoutes');
const profileRoutes = require("./routes/userRoutes/profileRoutes");
const userManagementRoutes = require('../backend/routes/adminRoutes/userManagementRoutes');
const cartRoutes = require('./routes/userRoutes/cartRoutes');
const WishlistRoutes = require('./routes/userRoutes/wishlistRoutes');
const addressRoutes = require("./routes/userRoutes/addressRoutes");
const orderRoutes = require('./routes/userRoutes/orderRoutes');
const adminOrderRoutes = require("./routes/adminRoutes/orderRoutes");
const userReviewRoutes = require('./routes/userRoutes/reviewRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));

// ✅ Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true,
}));

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", authRoute);
app.use('/api/category', categoriesRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin/user', userManagementRoutes);
app.use('/api/user/cart', cartRoutes);
app.use('/api/user/wishlist', WishlistRoutes);
app.use('/api/user/address', addressRoutes);
app.use('/api/user/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/user/review', userReviewRoutes);

// Error Handler 
app.use(errorHandler);

const startServer = async () => {
  logger.info("Starting Db...");
  logger.info("Starting server...");
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started successfully on PORT`, PORT);
      logger.info(`Server started successfully on PORT ${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to connect");
    process.exit(1);
  }
};

startServer();
