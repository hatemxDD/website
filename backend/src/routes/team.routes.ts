// src/routes/teamRoutes.ts
import express from "express";
import teamController from "../controllers/team.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const router = express.Router();

// Get routes (some public, some protected)
router.get("/", teamController.getAllTeams);
router.get("/my-teams", authMiddleware, teamController.getMyTeams);
router.get("/members/all", teamController.getAllTeamMembers);
router.get("/:id", teamController.getTeamById);
router.get("/:id/members", teamController.getTeamMembersByTeamId);
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

export default router;
