const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const app = express();

const PORT = process.env.PORT || 5000;
const logger = require('./config/logger')
const authRoute = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/categoryRoute')
const brandRoutes = require('./routes/brandRoutes')
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require("./routes/profileRoutes");
const userManagementRoutes = require('./routes/userManagementRoutes');
const cartRoutes = require('./routes/cartRoutes');
const WishlistRoutes = require('./routes/wishlistRoutes');
// Middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
// Your routes go here (add them before errorHandler)
app.use("/api/auth",authRoute);
app.use('/api/category',categoriesRoutes);
app.use('/api/brand',brandRoutes);
app.use('/api/products',productRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/admin',userManagementRoutes);
app.use('/api/user/cart',cartRoutes);
app.use('/api/user/wishlist',WishlistRoutes);

// Error Handler 
app.use(errorHandler);

const startServer = async()=>{
    logger.info("Starting Db...");
    logger.info("Starting server...");
    try {
     await connectDB();
     app.listen(PORT,()=>{
      console.log(`Server started Successfully on PORT`,PORT);
        logger.info(`Server started successfully on PORT ${PORT}`);
     })
        
    } catch (error) {
        logger.error("Unable to connect");
        process.exit(1);
    }
}
startServer();