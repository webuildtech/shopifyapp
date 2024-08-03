import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  
});

export default ThemeSchema;