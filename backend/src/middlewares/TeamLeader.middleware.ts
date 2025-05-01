// src/middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

// Extended request interface to include user data
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: Role;
  };
}

const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === Role.TeamLeader) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: TeamLeader role required" });
  }
};

export default adminMiddleware;
