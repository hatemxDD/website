// src/routes/newsRoutes.ts
import express from "express";
import newsController from "../controllers/news.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const router = express.Router();

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

export default router;
