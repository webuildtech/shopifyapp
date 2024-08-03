import mongoose from "mongoose";
import ProductVariantSchema from "../schemas/ProductVariant.js";

export default mongoose.model("ProductVariant", ProductVariantSchema);
