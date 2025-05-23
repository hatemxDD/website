// src/routes/userRoutes.ts
import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/authentication.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  userController.uploadImage
);

// Admin routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

export default router;
