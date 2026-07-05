import { Schema, model } from "mongoose";

const gallerySchema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Gallery = model("gallery", gallerySchema);
export default Gallery;
