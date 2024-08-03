import mongoose from "mongoose";
import ShopSchema from "../schemas/Shop.js";

export default mongoose.model("Shop", ShopSchema);
