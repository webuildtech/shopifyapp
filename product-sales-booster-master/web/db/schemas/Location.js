import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  href: {
    type: String,
  },
  host: {
    type: String,
  },
  hostname: {
    type: String,
  },
  pathname: {
    type: String,
  },
  origin: {
    type: String,
  },
  search: {
    type: String,
  }
});

export default LocationSchema;

