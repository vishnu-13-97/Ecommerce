const express = require('express');
const auth = require('../../middleware/jwt');
const { uploadProduct } = require('../../config/cloudinary');
const { addProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../../controller/admin/ProductController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve a list of all products with category and brand information.
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', getSingleProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product with all details and optional multiple images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - description
 *               - price
 *               - stock
 *               - category
 *               - brand
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15"
 *               type:
 *                 type: string
 *                 example: "Mobile Phone"
 *               description:
 *                 type: string
 *                 example: "Latest Apple smartphone with A17 Bionic chip"
 *               price:
 *                 type: number
 *                 example: 99999
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 description: MongoDB ObjectId of the category
 *                 example: "671f1c3b9b4b3d4f0b1a1234"
 *               brand:
 *                 type: string
 *                 description: MongoDB ObjectId of the brand
 *                 example: "671f1d4c9a7c2e5b0c2a5678"
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               images:
 *                 type: array
 *                 description: Product images
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Missing or invalid fields
 *       409:
 *         description: Product already exists
 *       500:
 *         description: Server error while adding product
 */
router.post('/', auth, isAdmin, uploadProduct.array('images', 5), addProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Update product details or replace images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid data or update failed
 *       404:
 *         description: Product not found
 */
router.put('/:id', auth, isAdmin, uploadProduct.array('images', 5), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Permanently remove a product by ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
