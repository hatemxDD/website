// src/controllers/newsController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Define custom request types
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Custom request type for authenticated requests with file upload
interface FileAuthRequest extends AuthRequest {
  file?: Express.Multer.File;
}

// Define upload directory
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

interface CreateNewsRequest {
  title: string;
  image: string;
  content: string;
  category: string;
  status: string;
  publishDate: Date;
  authorId: number;
}

interface UpdateNewsRequest {
  title?: string;
  image?: string;
  content?: string;
  category?: string;
  tags?: string[];
  status?: string;
  publishDate?: Date;
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

      const { title, image, content }: CreateNewsRequest = req.body;
      const authorId = req.user.id;

      // Create new news item
      const news = await prisma.news.create({
        data: {
          title,
          image,
          authorId,
          content,
          publishDate: new Date(),
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
      const {
        title,
        image,
        content,
        category,
        tags,
        status,
        publishDate,
      }: UpdateNewsRequest = req.body;

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
      if (content) updateData.content = content;
      if (category) updateData.category = category;
      if (tags) updateData.tags = tags;
      if (status) updateData.status = status;
      if (publishDate) updateData.publishDate = new Date(publishDate);

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

  // Upload news image
  uploadImage: async (req: FileAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: "No image file provided" });
        return;
      }

      // Get the file from multer
      const file = req.file;

      // Create unique filename
      const filename = `news_${Date.now()}${path.extname(file.originalname)}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Create public URL (based on your server setup)
      const baseUrl =
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const imageUrl = `${baseUrl}/uploads/${filename}`;

      // Save file to disk
      fs.writeFileSync(filepath, file.buffer);

      res.json({
        message: "News image uploaded successfully",
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error("Error uploading news image:", error);
      res.status(500).json({ message: "Server error during image upload" });
    }
  },
};

export default newsController;
