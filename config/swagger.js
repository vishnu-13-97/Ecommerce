// config/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// consr route = require('../routes/productRoutes')

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "API documentation for your ecommerce backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // Change to your base path
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust path if routes are in a different location
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
