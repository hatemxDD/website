// src/routes/projectRoutes.ts
import express from "express";
import projectController from "../controllers/project.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import TeamLeadermiddleware from "../middlewares/TeamLeader.middleware";

const router = express.Router();

// Get routes (some public, some protected)
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.get("/team/:teamId", projectController.getProjectsByTeam);

// Protected routes
router.post(
  "/",
  authMiddleware,
  projectController.createProject
);
router.put(
  "/:id",
  authMiddleware,
  projectController.updateProject
);
router.delete(
  "/:id",
  authMiddleware,
  projectController.deleteProject
);

export default router;
