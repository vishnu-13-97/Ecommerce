const express = require('express');
const { isUser } = require('../../middleware/isAdmin');
const {
  addAddress,
  updateAddress,
  removeAddress,
  getAddress,
  getAddressById
} = require('../../controller/user/addressController');
const auth = require('../../middleware/jwt');
const validate = require('../../middleware/validate');
const { addressSchema } = require('../../validators/addressValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User address management
 */

/**
 * @swagger
 * /address:
 *   post:
 *     summary: Add a new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Address added successfully
 */
router.post('/', auth, isUser, validate(addressSchema), addAddress);


/**
 * @swagger
 * /address/{id}:
 *   put:
 *     summary: Update an existing address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.put('/:id', auth, isUser, validate(addressSchema), updateAddress);


/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete('/:id', auth, isUser, removeAddress);


/**
 * @swagger
 * /address:
 *   get:
 *     summary: Get all addresses of logged-in user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 */
router.get('/', auth, isUser, getAddress);


/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Get a single address by ID
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address fetched successfully
 */
router.get('/:id', auth, isUser, getAddressById);

module.exports = router;
