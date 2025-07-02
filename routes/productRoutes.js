const express = require('express');
const auth = require('../middleware/jwt');

const { uploadProduct } = require('../config/cloudinary');
const { addProduct, getAllProducts,getSingleProduct, updateProduct ,deleteProduct} = require('../controller/admin/ProductController');
const { isAdmin } = require('../middleware/isAdmin');
const router = express.Router();


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get('/',getAllProducts);
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
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id',getSingleProduct);
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Product creation failed
 */
router.post('/', auth, isAdmin, uploadProduct.array("image", 5), addProduct);


router.put('/:id',auth,isAdmin,uploadProduct.array("image",5),updateProduct);
router.delete('/:id',auth,isAdmin,deleteProduct);

module.exports=router;