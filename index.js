import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import dns from "dns";

// Fix for Node.js SRV DNS lookup issues on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("⚠️ Warning: Failed to set custom DNS servers:", err.message);
}

// Routes
import adminRoute from "./routes/auth.route.js";
import jobRoutes from "./routes/jobListing.route.js";
import galleryRoutes from "./routes/gallery.route.js";
import enquiryRoute from "./routes/enquiry.route.js";
import tcRequestRoute from "./routes/tcRequest.route.js";
import admissionRoute from "./routes/admission.route.js";
import cbseDisclosureRoutes from "./routes/cbseDisclosure.route.js";
import cmsRoutes from "./routes/cms.route.js";
import { initSupabaseDb } from "./utils/supabaseDb.js";

// Razorpay
// import createPaymentOrder from "./utils/razorpay.js";

// Initialize
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONT_END_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        if (origin.startsWith("http://localhost:")) {
          return callback(null, true);
        }
        return callback(new Error("CORS policy blocked access from this origin"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files
app.use(
  "/v1/uploads/gallery",
  express.static(path.join(__dirname, "uploads/gallery"))
);
app.use("/cbse", express.static(path.join(__dirname, "/client/cbse")));
app.use("/", express.static(path.join(__dirname, "/client/dist")));

// Routes
app.use("/v1/api/auth", adminRoute);
app.use("/v1/api/jobs", jobRoutes);
app.use("/v1/api/gallery", galleryRoutes);
app.use("/v1/api/enquiry", enquiryRoute);
app.use("/v1/api/tc-request", tcRequestRoute);
app.use("/v1/api/admission", admissionRoute);
app.use("/v1/api/cbse-disclosure", cbseDisclosureRoutes);
app.use("/v1/api/cms", cmsRoutes);

// Health check
app.get("/health", (req, res) => res.send("✅ Server is up and healthy"));

// React app fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("❌ MONGO_URL is not set in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "rmcp",
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 DB Name: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌱 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

// Mongo Events
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB closed due to app termination");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

// Start
connectDB();
initSupabaseDb();
