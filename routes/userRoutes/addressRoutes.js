const express = require('express');
const { isUser, isAdmin } = require('../../middleware/isAdmin');
const { addAddress, updateAddress, removeAddress, getAddress } = require('../../controller/user/addressController');
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               pincode:
 *                 type: string
 *               addressLine:
 *                 type: string
 *               landmark:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *             required:
 *               - fullName
 *               - mobile
 *               - pincode
 *               - addressLine
 *               - city
 *               - state
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Invalid address data
 */

router.post('/', auth, isUser, validate(addressSchema), addAddress);
/**
 * @swagger
 * /address:
 *   put:
 *     summary: Update an existing address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               pincode:
 *                 type: string
 *               addressLine:
 *                 type: string
 *               landmark:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *             required:
 *               - addressId
 *               - fullName
 *               - mobile
 *               - pincode
 *               - addressLine
 *               - city
 *               - state
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid request data
 */

router.put('/', auth, isUser, validate(addressSchema), updateAddress);

/**
 * @swagger
 * /address:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *             required:
 *               - addressId
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       400:
 *         description: Invalid address ID
 */

router.delete('/', auth, isUser, validate(addressSchema), removeAddress);
/**
 * @swagger
 * /address:
 *   get:
 *     summary: Get all addresses of the logged-in user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *       401:
 *         description: Unauthorized
 */

router.get('/', auth, isUser, getAddress);

module.exports = router;
