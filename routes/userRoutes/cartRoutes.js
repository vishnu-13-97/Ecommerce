const express = require('express');
const auth = require("../../middleware/jwt");
const { isUser } = require('../../middleware/isAdmin');
const { addToCart, removeFromCart, viewCart } = require('../../controller/user/cartController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User shopping cart management
 */

/**
 * @swagger
 * /user/cart:
 *   post:
 *     summary: Add a product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Invalid input or product not found
 */
router.post('/', auth, isUser, addToCart);

/**
 * @swagger
 * /user/cart:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       400:
 *         description: Invalid productId
 */
router.delete('/', auth, isUser, removeFromCart);

/**
 * @swagger
 * /user/cart:
 *   get:
 *     summary: View current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, isUser, viewCart);

module.exports = router;
