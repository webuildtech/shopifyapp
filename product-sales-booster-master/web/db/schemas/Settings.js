import mongoose from "mongoose";
import PixelSchema from "./Pixel.js";
import ThemeSchema from "./Theme.js";

const SettingsSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
    unique: true,
  },
  pixel: PixelSchema,
  theme: ThemeSchema,
});

export default SettingsSchema;