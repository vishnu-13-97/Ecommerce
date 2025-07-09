# 🛒 E-Commerce Backend API

A powerful and scalable backend REST API for an e-commerce application built using **Node.js**, **Express**, **MongoDB**, and other essential tools. This project focuses on the backend functionalities such as user management, authentication, product handling, cart management, order processing, and admin features.

> ⚠️ This project does not include a frontend — it provides backend APIs to be consumed by frontend/mobile applications.

---

## 🚀 Features

- ✅ User registration and login (with JWT-based auth)
- ✅ Admin and user role segregation
- ✅ Product CRUD operations (admin only)
- ✅ Product image upload via Cloudinary
- ✅ Category & subcategory management
- ✅ Cart management (add/remove items)
- ✅ Order creation and status updates
- ✅ Rate limiter for API protection
- ✅ Input validation with Joi
- ✅ Redis for caching and performance
- ✅ Secure routes with role-based access control

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| Node.js    | JavaScript runtime |
| Express.js | Web framework |
| MongoDB    | NoSQL Database |
| Mongoose   | ODM for MongoDB |
| Redis      | In-memory caching |
| Cloudinary | Image hosting |
| JWT        | Authentication |
| Joi        | Input validation |
| Docker     | Containerization (optional) |

--- 

## <details> <summary>📁 Project Structure</summary>
```
/ecommerce-backend
│
├── config/ # Configuration files (DB,Cloudinary,logger,ratelimit,redis,etc.)
├── controllers/ # Controller logic for routes
├── middleware/ # Custom middleware (auth, error handling, etc.)
├── models/ # Mongoose models
├── routes/ # API route definitions
├── utils/ # Utility functions
├── services/ # Business logic layer
├── .env # Environment variables
├── index.js # Express setup and Server entry point
└── README.md

</details>

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishnu-13-97/Ecommerce
   cd ecommerce-backend
2. **Install dependencies**
   ```bash
   npm install
3. **Create .env file**
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   REDIS_URL=redis://localhost:6379
4. **Start the server**
   ```bash
   npm run dev



## 📬 API Endpoints Overview

## 📑 API Documentation

Access full API documentation at:  
**GET** `/api-docs` — Swagger UI


 ## 👤 Auth

POST /api/auth/register – User registration

POST /api/auth/login – User login

GET /api/auth/profile – Get current user info (protected)

## 🛍️ Products

GET /api/products – List all products

GET /api/products/:id – Product details

POST /api/products – Create product (admin)

PUT /api/products/:id – Update product (admin)

DELETE /api/products/:id – Delete product (admin)

## 🧺 Cart

POST /api/user/cart – Add product to cart

GET /api/user/ – Get user cart

DELETE /api/user/cart/:productId – Remove item from cart

## 📦 Orders
POST /api/user/orders – Create an order

GET /api/user/orders – Get user orders

PUT /api/user/orders/:id – Update order status (admin)



## 🔐 All sensitive routes are protected using role-based middleware.


# 🐳 Docker Support

 ```bash
docker build -t ecommerce-api .
docker run -p 5000:5000 ecommerce-api
---

## ✍️ Author

**Vishnu C P**  
Node.js Developer | MERN Stack Enthusiast  
[GitHub](https://github.com/vishnu-13-97) | [LinkedIn](https://www.linkedin.com/in/vishnu-c-21104b348/) 













