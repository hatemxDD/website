// src/controllers/projectController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ProjectState } from "@prisma/client";

const prisma = new PrismaClient();

// Define custom request types
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

interface CreateProjectRequest {
  name: string;
  description?: string;
  state?: ProjectState;
  image?: string;
  teamId: number;
}

interface UpdateProjectRequest {
  name?: string;
  description?: string;
  state?: ProjectState;
  image?: string;
  teamId?: number;
}

// Project Controller
const projectController = {
  // Create a new project
  createProject: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { name, description, state, image, teamId }: CreateProjectRequest =
        req.body;

      // Check if the team exists
      const team = await prisma.team.findUnique({
        where: { id: Number(teamId) },
      });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      // Check if user is the leader of this specific team
      if (team.leaderId !== req.user.id) {
        res
          .status(403)
          .json({
            message: "Only the team leader can create projects for this team",
          });
        return;
      }

      // Create new project
      const project = await prisma.project.create({
        data: {
          name,
          description,
          state: state || "PLANNING",
          image,
          teamId:Number(teamId),
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Server error during project creation" });
    }
  },

  // Get all projects
  getAllProjects: async (_req: Request, res: Response): Promise<void> => {
    try {
      const projects = await prisma.project.findMany({
        include: {
          team: {
            select: {
              id: true,
              name: true,
              acro: true,
              leader: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Server error while fetching projects" });
    }
  },

  // Get project by ID
  getProjectById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const project = await prisma.project.findUnique({
        where: { id: Number(id) },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              acro: true,
              leader: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Server error while fetching project" });
    }
  },

  // Update project
  updateProject: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, state, image, teamId }: UpdateProjectRequest =
        req.body;

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: Number(id) },
        include: {
          team: true,
        },
      });

      if (!existingProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      // Check if user is the leader of the project's team
      if (existingProject.team.leaderId !== req.user?.id) {
        res
          .status(403)
          .json({ message: "Only the team leader can update this project" });
        return;
      }

      // If teamId is changing, check if the new team exists and user is the leader of that team
      if (teamId && teamId !== existingProject.teamId) {
        const newTeam = await prisma.team.findUnique({
          where: { id: Number(teamId) },
        });

        if (!newTeam) {
          res.status(404).json({ message: "New team not found" });
          return;
        }

      }

      // Prepare update data
      const updateData: UpdateProjectRequest = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (state) updateData.state = state;
      if (image !== undefined) updateData.image = image;
      if (teamId) updateData.teamId = Number(teamId);

      // Update project
      const updatedProject = await prisma.project.update({
        where: { id: Number(id) },
        data: updateData,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              acro: true,
            },
          },
        },
      });

      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Server error while updating project" });
    }
  },

  // Delete project
  deleteProject: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: Number(id) },
        include: {
          team: true,
        },
      });

      if (!existingProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      // Check if user is the leader of the project's team
      if (existingProject.team.leaderId !== req.user?.id) {
        res
          .status(403)
          .json({ message: "Only the team leader can delete this project" });
        return;
      }

      // Delete the project
      await prisma.project.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Server error while deleting project" });
    }
  },

  // Get projects by team ID
  getProjectsByTeam: async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params;

      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { id: Number(teamId) },
      });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      // Get projects for the team
      const projects = await prisma.project.findMany({
        where: { teamId: Number(teamId) },
        include: {
          team: {
            select: {
              name: true,
              acro: true,
            },
          },
        },
      });

      res.json(projects);
    } catch (error) {
      console.error("Error fetching team projects:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching team projects" });
    }
  },
};

export default projectController;
