import mongoose from "mongoose";
import ProductVariantSchema from "./ProductVariant.js";
import ProductSchema from "./Product.js";

const LineItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  inventoryQuantity: { type: Number },
  product: ProductSchema,
  variant: ProductVariantSchema,
});

export default LineItemSchema;
