// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/user.routes";
import teamRoutes from "./routes/team.routes";
import projectRoutes from "./routes/project.routes";
import newsRoutes from "./routes/news.routes";
import articleRoutes from "./routes/article.routes";
import contactRoutes from "./routes/contact.routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define upload directory path
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "../uploads");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(UPLOAD_DIR));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/contact", contactRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API is running",
    endpoints: [
      "/api/users",
      "/api/teams",
      "/api/projects",
      "/api/news",
      "/api/articles",
      "/api/contact",
    ],
  });
});

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: "An unexpected error occurred",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//   });
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
