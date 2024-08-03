import mongoose from "mongoose";
import LocationSchema from "./Location.js";
import ProductSchema from "./Product.js";
import ProductVariantSchema from "./ProductVariant.js";

const EventSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  pageTitle: {
    type: String,
  },
  url: LocationSchema,
  referrer: LocationSchema,
  language: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  product: ProductSchema,
});

/*EventSchema.virtual("event", {
  ref: "Product",
  localField: "product",
  foreignField: "_id",
  justOne: true,
});*/

export default EventSchema;

