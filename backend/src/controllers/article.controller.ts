// src/controllers/articleController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define custom request types
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

interface CreateArticleRequest {
  title: string;
  content: string;
  publishDate: Date;
  authorId: number;
  pdfLink: string;
  journalLink: string;
}

interface UpdateArticleRequest {
  title?: string;
  content?: string;
  authorId?: number;
  publishDate?: Date;
  pdfLink?: string;
  journalLink?: string;
}

// Article Controller
const articleController = {
  // Create an article
  createArticle: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { title, content, publishDate, pdfLink, journalLink }: CreateArticleRequest = req.body;
      const authorId = req.user.id;

      // Create new article
      const article = await prisma.article.create({
        data: {
          title,
          content,
          authorId,
          publishDate,
          pdfLink,
          journalLink,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Server error during article creation" });
    }
  },

  // Get all articles
  getAllArticles: async (_req: Request, res: Response): Promise<void> => {
    try {
      const articles = await prisma.article.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Server error while fetching articles" });
    }
  },

  // Get article by ID
  getArticleById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const article = await prisma.article.findUnique({
        where: { id: Number(id) },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Server error while fetching article" });
    }
  },

  // Update article
  updateArticle: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, publishDate, pdfLink, journalLink }: UpdateArticleRequest = req.body;

      // Check if article exists
      const existingArticle = await prisma.article.findUnique({
        where: { id: Number(id) },
      });

      if (!existingArticle) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      // Check if user is authorized (author or admin)
      if (
        req.user?.role !== "LabLeader" &&
        existingArticle.authorId !== req.user?.id
      ) {
        res
          .status(403)
          .json({ message: "Not authorized to update this article" });
        return;
      }

      // Prepare update data
      const updateData: UpdateArticleRequest = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (publishDate) updateData.publishDate = publishDate;
      if (pdfLink) updateData.pdfLink = pdfLink;
      if (journalLink) updateData.journalLink = journalLink;

      // Update article
      const updatedArticle = await prisma.article.update({
        where: { id: Number(id) },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Server error while updating article" });
    }
  },

  // Delete article
  deleteArticle: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if article exists
      const existingArticle = await prisma.article.findUnique({
        where: { id: Number(id) },
      });

      if (!existingArticle) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      // Check if user is authorized (author or admin)
      if (
        req.user?.role !== "LabLeader" &&
        existingArticle.authorId !== req.user?.id
      ) {
        res
          .status(403)
          .json({ message: "Not authorized to delete this article" });
        return;
      }

      // Delete the article
      await prisma.article.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Server error while deleting article" });
    }
  },

  // Get articles by author ID
  getArticlesByAuthor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { authorId } = req.params;

      const articles = await prisma.article.findMany({
        where: { authorId: Number(authorId) },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(articles);
    } catch (error) {
      console.error("Error fetching author articles:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching author articles" });
    }
  },
};

export default articleController;
