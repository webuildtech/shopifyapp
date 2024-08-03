import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  domain: String,
  country: String,
  country_code: String,
  country_name: String,
  currency: String,
  money_format: String,
  money_with_currency_format: String,
  shop: String,
});

export default ShopSchema;
