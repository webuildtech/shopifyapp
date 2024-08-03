import mongoose from "mongoose";

const MoneyBagSchema = new mongoose.Schema({
  amount: Number,
  currencyCode: String,
});

export default MoneyBagSchema;
