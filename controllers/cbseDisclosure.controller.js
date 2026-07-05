import CBSEDisclosure from "../models/cbseDisclosure.model.js";
import { uploadCloud } from "../utils/cloudinary.js";

// 🔹 Get CBSE Disclosure data
export const getDisclosure = async (req, res) => {
  try {
    let disclosure = await CBSEDisclosure.findOne();
    if (!disclosure) {
      disclosure = await CBSEDisclosure.create({});
    }
    res.json(disclosure);
  } catch (err) {
    console.error("Get Disclosure Error:", err);
    res.status(500).json({ error: "Failed to fetch disclosure data" });
  }
};

// 🔹 Update CBSE Disclosure data
export const updateDisclosure = async (req, res) => {
  try {
    let disclosure = await CBSEDisclosure.findOne();
    if (!disclosure) {
      disclosure = await CBSEDisclosure.create(req.body);
    } else {
      await CBSEDisclosure.updateOne({ _id: disclosure._id }, req.body);
      disclosure = await CBSEDisclosure.findById(disclosure._id);
    }
    res.json(disclosure);
  } catch (err) {
    console.error("Update Disclosure Error:", err);
    res.status(500).json({ error: "Failed to update disclosure data" });
  }
};

export const uploadDisclosureDoc = [
  uploadCloud,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const file = req.files[0]; // Because we're using `.any()`
      res.json({ url: file.path });
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ error: "Failed to upload document" });
    }
  },
];
