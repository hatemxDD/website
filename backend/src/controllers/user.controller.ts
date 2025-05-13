// src/controllers/userController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, User } from "@prisma/client";
const prisma = new PrismaClient();

// Environment variables should be configured in a .env file
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Define request types with proper interfaces
interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  role?: Role;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: Role;
  password?: string;
}

// Custom request type for authenticated requests
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: Role;
  };
}

// Helper function to exclude password from user object
const excludePassword = (user: User): Omit<User, "password"> => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// User Controller
const userController = {
  // Register a new user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, password, role }: RegisterRequest = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res
          .status(400)
          .json({ message: "User already exists with this email" });
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: role || "TeamMember", // Default to USER role if not specified
        },
      });

      // Return user without password
      res.status(201).json(excludePassword(user));
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginRequest = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: excludePassword(user),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          leadingTeams: true,
          memberOfTeams: {
            include: {
              team: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error while fetching user" });
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, email, role, password }: UpdateUserRequest = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Prepare update data
      const updateData: UpdateUserRequest = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
      });

      res.json(excludePassword(updatedUser));
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Server error while updating user" });
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Delete user
      await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error while deleting user" });
    }
  },

  // Get current user profile
  getProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          leadingTeams: true,
          memberOfTeams: {
            include: {
              team: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Server error while fetching profile" });
    }
  },

  // Update current user's profile
  updateProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const userId = req.user.id;
      const { name, email, password }: UpdateUserRequest = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Prepare update data
      const updateData: UpdateUserRequest = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      res.json(excludePassword(updatedUser));
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error while updating profile" });
    }
  },

};

export default userController;
