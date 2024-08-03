import mongoose from "mongoose";
import ProductSchema from "./Product.js";

const ProductVariantSchema = new mongoose.Schema({
  id: { type: String, required: false, unique: false },
  productId: { type: String, required: false },
  imageSrc: { type: String },
  price: { type: Number },
  currencyCode: { type: String },
  sku: { type: String },
  title: { type: String },
  inventoryQuantity: { type: Number },
});

export default ProductVariantSchema;




