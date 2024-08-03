import mongoose from "mongoose";
import ProductSchema from "../schemas/Product.js";

export default mongoose.model("Product", ProductSchema);
