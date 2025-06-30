const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


ProductSchema.pre("save", function (next) {
  // Only generate slug if name is new or modified
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // removes special characters
      trim: true,
    });
  }
  next();
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
