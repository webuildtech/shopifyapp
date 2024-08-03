import mongoose from "mongoose";
import ProductVariantSchema from "./ProductVariant.js";


const ProductSchema = new mongoose.Schema({
  id: { type: String },
  shop: String,
  title: { type: String },
  vendor: { type: String },
  type: { type: String },
  status: { type: String },
  handle: String,
  tags: [String],
  margin: Number,
  variants: [ProductVariantSchema],
  selectedAsRandom: Boolean,
});



export default ProductSchema;

