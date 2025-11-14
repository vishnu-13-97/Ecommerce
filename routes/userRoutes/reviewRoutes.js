const express = require('express');
const auth = require('../../middleware/jwt');
const { isUser } = require('../../middleware/isAdmin');
const {addaReview, deleteReview, getaProductReview, updateReview, getAllReview} = require('../../controller/user/reviewController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: User product reviews
 */

/**
 * @swagger
 * /user/review:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *       500:
 *         description: Server error
 */
router.get('/', getAllReview);

/**
 * @swagger
 * /user/review/add/{id}:
 *   post:
 *     summary: Add a review to a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             required:
 *               - rating
 *               - comment
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/add/:id', auth, isUser, addaReview);

/**
 * @swagger
 * /user/review/delete/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/delete/:id', auth, isUser, deleteReview);

/**
 * @swagger
 * /user/review/get/{id}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *       404:
 *         description: Product not found or no reviews
 */
router.get('/get/:id', auth, isUser, getaProductReview);

/**
 * @swagger
 * /user/review/update/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             required:
 *               - rating
 *               - comment
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/update/:id', auth, isUser, updateReview);

module.exports = router;
