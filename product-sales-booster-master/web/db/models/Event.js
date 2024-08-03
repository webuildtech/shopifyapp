import mongoose from "mongoose";
import EventSchema from "../schemas/Event.js";

export default mongoose.model("Event", EventSchema);
