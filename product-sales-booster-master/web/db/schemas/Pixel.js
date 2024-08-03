import mongoose from "mongoose";

const PixelSchema = new mongoose.Schema({
  id: { type: String, required: true },
});

export default PixelSchema;