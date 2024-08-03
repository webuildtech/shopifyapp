import mongoose from "mongoose";
import SettingsSchema from "../schemas/Settings.js";

export default mongoose.model("Settings", SettingsSchema);
