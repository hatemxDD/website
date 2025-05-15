// src/routes/newsRoutes.ts
import express from "express";
import newsController from "../controllers/news.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Public routes
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.get("/author/:authorId", newsController.getNewsByAuthor);

// Protected routes
router.post("/", authMiddleware, adminMiddleware, newsController.createNews);
router.put("/:id", authMiddleware, adminMiddleware, newsController.updateNews);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  newsController.deleteNews
);

// Image upload route
router.post(
  "/upload-image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  newsController.uploadImage
);

export default router;
