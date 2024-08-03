import mongoose from "mongoose";
import OrderSchema from "../schemas/Order.js";

export default mongoose.model("Order", OrderSchema);

