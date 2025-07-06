const express = require('express');
const auth = require('../../middleware/jwt');
const { isAdmin } = require('../../middleware/isAdmin');
const { getAllOrders, getOrderById, updateOrderStatus } = require('../../controller/admin/OrderManagementController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminOrders
 *   description: Admin order management
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', auth, isAdmin, getAllOrders);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', auth, isAdmin, getOrderById);

/**
 * @swagger
 * /admin/orders/{id}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */
router.put('/:id', auth, isAdmin, updateOrderStatus);

module.exports = router;
