// src/routes/teamRoutes.ts
import express from "express";
import teamController from "../controllers/team.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const router = express.Router();

// Get routes (some public, some protected)
router.get("/", teamController.getAllTeams);
router.get("/my-teams", authMiddleware, teamController.getMyTeams);
router.get("/:id", teamController.getTeamById);

// Protected routes
router.post("/", authMiddleware, teamController.createTeam);
router.put("/:id", authMiddleware, teamController.updateTeam);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  teamController.deleteTeam
);

// Team membership routes
router.post("/:id/members", authMiddleware, teamController.addTeamMember);
router.delete(
  "/:id/members/:userId",
  authMiddleware,
  teamController.removeTeamMember
);

// Protected routes
router.use(authMiddleware);

// Team member routes
router.get("/members", teamController.getAllTeamMembers);
router.get("/members/team/:teamId", teamController.getTeamMembersByTeamId);
router.get("/members/user/:userId", teamController.getTeamsByUserId);

export default router;
