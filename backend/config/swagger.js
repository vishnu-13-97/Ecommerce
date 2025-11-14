const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "API documentation for your ecommerce backend",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // 👇 This is the missing piece — adds global bearer auth
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Profile" },
      { name: "Categories" },
      { name: "Products" },
      { name: "Cart" },
      { name: "Wishlist" },
      { name: "Orders" },
      { name: "Address" },
      { name: "AdminOrders" },
    ],
  },
  apis: ["./routes/**/*.js"], // Adjust path if needed
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
