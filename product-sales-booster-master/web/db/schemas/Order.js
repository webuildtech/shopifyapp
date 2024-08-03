import mongoose from "mongoose";
import LineItemSchema from "./LineItem.js";
import MoneyBagSchema from "./MoneyBag.js";
const OrderSchema = new mongoose.Schema({
  id: String,
  name: String,
  shop: String,
  discountCodes: [String],
  price: MoneyBagSchema,
  lineItems: [LineItemSchema],
});

export default OrderSchema;
