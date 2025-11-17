const express = require('express');
const { isUser } = require('../../middleware/isAdmin');
const auth = require('../../middleware/jwt');
const { placeOrder, getMyOrders, cancelOrder, getSingleOrder } = require('../../controller/user/orderController');
const router = express.Router();







/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: User order management
 */

/**
 * @swagger
 * /user/orders:
 *   post:
 *     summary: Place a new order
 *     description: Creates a new order for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               addressId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 example: "COD"
 *             required:
 *               - items
 *               - addressId
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid input or empty cart
 *       404:
 *         description: Shipping address or product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/orders:
 *   get:
 *     summary: Get all orders of the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort by order creation date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: Processing
 *         description: Filter by order status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/orders/cancel-order/{id}:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order already delivered or already cancelled
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/orders/{id}:
 *   get:
 *     summary: Get single order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */


router.post('/',auth,isUser,placeOrder);
router.get('/',auth,isUser,getMyOrders);
router.put('/cancel-order/:id',auth,isUser,cancelOrder);
router.get('/:id',auth,isUser,getSingleOrder);
module.exports=router;

