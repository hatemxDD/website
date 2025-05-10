// src/routes/userRoutes.ts
import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const router = express.Router();

// Public routes
router.post("/register",authMiddleware, adminMiddleware, userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

// Admin routes
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

export default router;
