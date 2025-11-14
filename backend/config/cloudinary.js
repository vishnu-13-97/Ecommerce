const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce_assets/product_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce_assets/category_banners',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const brandStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce_assets/brand_logos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce_assets/user_avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

module.exports = {
  cloudinary,
  uploadProduct: multer({ storage: productStorage }),
  uploadCategory: multer({ storage: categoryStorage }),
  uploadBrand: multer({ storage: brandStorage }),
  uploadAvatar: multer({ storage: avatarStorage }),
};


