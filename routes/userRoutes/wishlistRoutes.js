const express = require('express');
const auth = require('../../middleware/jwt');
const { isUser } = require('../../middleware/isAdmin');
const { addToWishList, removeFromWishlist, getWishList } = require('../../controller/user/wishListController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Manage user's wishlist
 */

/**
 * @swagger
 * /user/wishlist:
 *   post:
 *     summary: Add a product to wishlist
 *     tags: [Wishlist]
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
 *         description: Product added to wishlist
 *       400:
 *         description: Invalid product or already in wishlist
 */
router.post('/', auth, isUser, addToWishList);

/**
 * @swagger
 * /user/wishlist:
 *   delete:
 *     summary: Remove a product from wishlist
 *     tags: [Wishlist]
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
 *         description: Product removed from wishlist
 *       400:
 *         description: Product not found in wishlist
 */
router.delete('/', auth, isUser, removeFromWishlist);

/**
 * @swagger
 * /user/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all products in the user's wishlist
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, isUser, getWishList);

module.exports = router;
