import multer from "multer";
import path from "path";
import fs from "fs";
import Gallery from "../models/gallery.model.js";

// 🔹 Multer Setup for File Uploads
const uploadDir = path.join(process.cwd(), "uploads", "gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/gallery/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)), // Unique filename
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB max file size
}).single("image");

// ✅ CREATE: Add a new gallery entry
export const createGallery = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err)
      return res
        .status(400)
        .json({ error: err.message || "File upload failed" });
    if (!req.file)
      return res.status(400).json({ error: "Image file is required" });

    try {
      const { title, description } = req.body;
      const newGallery = await Gallery.create({
        title,
        description,
        image: `/uploads/gallery/${req.file.filename}`,
      });

      res.status(201).json({
        message: "Gallery entry created successfully",
        gallery: newGallery,
      });
    } catch (err) {
      next(err);
    }
  });
};

// ✅ READ: Get all gallery entries with image URLs
export const getGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.find().select(["image", "title"]);
    res.status(200).json(gallery);
  } catch (err) {
    next(err);
  }
};

// ✅ READ: Get a single gallery entry by ID
export const getGalleryById = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery)
      return res.status(404).json({ error: "Gallery entry not found" });

    res.status(200).json(gallery);
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE: Modify a gallery entry
export const updateGallery = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err)
      return res
        .status(400)
        .json({ error: err.message || "File upload failed" });

    try {
      const { title, description } = req.body;
      const updateData = { title, description };

      if (req.file) {
        // Delete old image if a new one is uploaded
        const galleryItem = await Gallery.findById(req.params.id);
        if (galleryItem && galleryItem.image) {
          fs.unlinkSync(path.join(process.cwd(), galleryItem.image));
        }
        updateData.image = `/uploads/gallery/${req.file.filename}`;
      }

      const updatedGallery = await Gallery.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedGallery)
        return res.status(404).json({ error: "Gallery entry not found" });

      res.status(200).json({
        message: "Gallery entry updated successfully",
        gallery: updatedGallery,
      });
    } catch (err) {
      next(err);
    }
  });
};

// ✅ DELETE: Remove a gallery entry
export const deleteGallery = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem)
      return res.status(404).json({ message: "Item not found" });

    // Delete the image file
    await Gallery.findByIdAndDelete(req.params.id);
    fs.unlinkSync(path.join(process.cwd(), galleryItem.image));

    res.status(200).json({
      message: `Gallery entry "${galleryItem.title}" deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
