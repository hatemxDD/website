// src/routes/articleRoutes.ts
import express from "express";
import articleController from "../controllers/article.controller";
import authMiddleware from "../middlewares/authentication.middleware";

const router = express.Router();

// Public routes
router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);
router.get("/author/:authorId", articleController.getArticlesByAuthor);

// Protected routes
router.post("/", authMiddleware, articleController.createArticle);
router.put("/:id", authMiddleware, articleController.updateArticle);
router.delete("/:id", authMiddleware, articleController.deleteArticle);

export default router;
