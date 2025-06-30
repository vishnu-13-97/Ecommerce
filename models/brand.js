const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
    },slug: {
      type: String,
      unique: true,
      index: true,
    },
    logo: {
      public_id: String,
      url: String,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
