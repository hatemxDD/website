// src/controllers/newsController.ts
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

interface CreateNewsRequest {
  title: string;
  image: string;
}

interface UpdateNewsRequest {
  title?: string;
  image?: string;
}

// News Controller
const newsController = {
  // Create a news item
  createNews: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { title, image }: CreateNewsRequest = req.body;
      const authorId = req.user.id;

      // Create new news item
      const news = await prisma.news.create({
        data: {
          title,
          image,
          authorId,
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

      res.status(201).json(news);
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(500).json({ message: "Server error during news creation" });
    }
  },

  // Get all news items
  getAllNews: async (_req: Request, res: Response): Promise<void> => {
    try {
      const news = await prisma.news.findMany({
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

      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Server error while fetching news" });
    }
  },

  // Get news by ID
  getNewsById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const news = await prisma.news.findUnique({
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

      if (!news) {
        res.status(404).json({ message: "News not found" });
        return;
      }

      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Server error while fetching news" });
    }
  },

  // Update news
  updateNews: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, image }: UpdateNewsRequest = req.body;

      // Check if news exists
      const existingNews = await prisma.news.findUnique({
        where: { id: Number(id) },
      });

      if (!existingNews) {
        res.status(404).json({ message: "News not found" });
        return;
      }

      // Check if user is authorized (author or admin)
      if (
        req.user?.role !== "LabLeader" &&
        existingNews.authorId !== req.user?.id
      ) {
        res
          .status(403)
          .json({ message: "Not authorized to update this news item" });
        return;
      }

      // Prepare update data
      const updateData: UpdateNewsRequest = {};
      if (title) updateData.title = title;
      if (image) updateData.image = image;

      // Update news
      const updatedNews = await prisma.news.update({
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

      res.json(updatedNews);
    } catch (error) {
      console.error("Error updating news:", error);
      res.status(500).json({ message: "Server error while updating news" });
    }
  },

  // Delete news
  deleteNews: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if news exists
      const existingNews = await prisma.news.findUnique({
        where: { id: Number(id) },
      });

      if (!existingNews) {
        res.status(404).json({ message: "News not found" });
        return;
      }

      // Check if user is authorized (author or admin)
      if (
        req.user?.role !== "LabLeader" &&
        existingNews.authorId !== req.user?.id
      ) {
        res
          .status(403)
          .json({ message: "Not authorized to delete this news item" });
        return;
      }

      // Delete the news
      await prisma.news.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "News deleted successfully" });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Server error while deleting news" });
    }
  },

  // Get news by author ID
  getNewsByAuthor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { authorId } = req.params;

      const news = await prisma.news.findMany({
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

      res.json(news);
    } catch (error) {
      console.error("Error fetching author news:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching author news" });
    }
  },
};

export default newsController;
