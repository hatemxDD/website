// src/controllers/teamController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Team } from "@prisma/client";

const prisma = new PrismaClient();

// Define custom request types
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

interface CreateTeamRequest {
  name: string;
  description?: string;
  acro: string;
  leaderId: number;
}

interface UpdateTeamRequest {
  name?: string;
  description?: string;
  acro?: string;
  leaderId?: number;
}

interface AddMemberRequest {
  userId: number;
}

// Team Controller
const teamController = {
  // Create a new team
  createTeam: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { name, description, acro, leaderId }: CreateTeamRequest = req.body;

      // Check if a team with the same name already exists
      const existingTeam = await prisma.team.findFirst({
        where: { name: name },
      });

      // Check if the team is already created by the user
      const existingTeamByUser = await prisma.team.findFirst({
        where: { leaderId: req.user.id },
      });

      if (existingTeamByUser) {
        res.status(400).json({ message: "You already have a team created" });
        return;
      }

      if (existingTeam) {
        res
          .status(400)
          .json({ message: "A team with this name already exists" });
        return;
      }

      // Convert leaderId to number and validate
      const leaderIdNumber = Number(leaderId);
      if (isNaN(leaderIdNumber)) {
        res.status(400).json({ message: "Invalid leaderId format" });
        return;
      }

      // Check if the user to be set as leader exists
      const leader = await prisma.user.findUnique({
        where: { id: leaderIdNumber },
      });

      if (!leader) {
        res.status(404).json({ message: "User selected as leader not found" });
        return;
      }

      // Update user role if needed based on current role
      if (leader.role === "TeamMember") {
        // Update the TeamMember to TeamLeader
        await prisma.user.update({
          where: { id: leaderIdNumber },
          data: { role: "TeamLeader" },
        });
      } else if (leader.role !== "TeamLeader") {
        res.status(400).json({
          message:
            "Selected user cannot be assigned as team leader with current role",
        });
        return;
      }
      // If role is already "TeamLeader" , no need to update

      // Create new team
      const team = await prisma.team.create({
        data: {
          name,
          description,
          acro,
          leaderId: leaderIdNumber,
        },
      });

      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Server error during team creation" });
    }
  },

  // Get all teams
  getAllTeams: async (_req: Request, res: Response): Promise<void> => {
    try {
      const teams = await prisma.team.findMany({
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      });

      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Server error while fetching teams" });
    }
  },

  // Get team by ID
  getTeamById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const team = await prisma.team.findUnique({
        where: { id: Number(id) },
        include: {
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
          projects: true,
        },
      });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Server error while fetching team" });
    }
  },

  // Update team
  updateTeam: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, acro, leaderId }: UpdateTeamRequest = req.body;

      // Check if team exists
      const existingTeam = await prisma.team.findUnique({
        where: { id: Number(id) },
        include: {
          leader: true,
        },
      });

      if (!existingTeam) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      // Authorization check: only team leader can update
      if (existingTeam.leaderId !== req.user?.id) {
        res.status(403).json({ message: "Not authorized to update this team" });
        return;
      }

      // Prepare update data
      const updateData: UpdateTeamRequest = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (acro) updateData.acro = acro;
      if (Number(leaderId)) updateData.leaderId = Number(leaderId);

      // Update team
      const updatedTeam = await prisma.team.update({
        where: { id: Number(id) },
        data: updateData,
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(updatedTeam);
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ message: "Server error while updating team" });
    }
  },

  // Delete team
  deleteTeam: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if team exists
      const existingTeam = await prisma.team.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTeam) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      // Authorization check: only team leader or admin can delete
      if (
        req.user?.role !== "LabLeader" &&
        existingTeam.leaderId !== req.user?.id
      ) {
        res.status(403).json({ message: "Not authorized to delete this team" });
        return;
      }

      // First delete all team members to avoid foreign key constraints
      await prisma.teamMember.deleteMany({
        where: { teamId: Number(id) },
      });

      // Then delete the team
      await prisma.team.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ message: "Server error while deleting team" });
    }
  },

  // Add a member to the team
  addTeamMember: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { userId }: AddMemberRequest = req.body;

      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { id: Number(id) },
      });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      // Authorization check: only team leader or admin can add members
      if (req.user?.role !== "LabLeader" && team.leaderId !== req.user?.id) {
        res.status(403).json({
          message: "Not authorized to add members to this team",
        });
        return;
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Check if user is already a member
      const existingMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: Number(id),
            userId: Number(userId),
          },
        },
      });

      if (existingMember) {
        res
          .status(400)
          .json({ message: "User is already a member of this team" });
        return;
      }

      // Add user to team
      const teamMember = await prisma.teamMember.create({
        data: {
          teamId: Number(id),
          userId: Number(userId),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error adding team member:", error);
      res
        .status(500)
        .json({ message: "Server error while adding team member" });
    }
  },

  // Remove a member from the team
  removeTeamMember: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id, userId } = req.params;

      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { id: Number(id) },
      });

      if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
      }

      // Authorization check: only team leader or admin can remove members
      if (req.user?.role !== "LabLeader" && team.leaderId !== req.user?.id) {
        res.status(403).json({
          message: "Not authorized to remove members from this team",
        });
        return;
      }

      // Check if user is a member of the team
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: Number(id),
            userId: Number(userId),
          },
        },
      });

      if (!teamMember) {
        res.status(404).json({ message: "User is not a member of this team" });
        return;
      }

      // Remove user from team
      await prisma.teamMember.delete({
        where: {
          teamId_userId: {
            teamId: Number(id),
            userId: Number(userId),
          },
        },
      });

      res.json({ message: "Team member removed successfully" });
    } catch (error) {
      console.error("Error removing team member:", error);
      res
        .status(500)
        .json({ message: "Server error while removing team member" });
    }
  },

  // Get teams led by current user
  getMyTeams: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const userId = req.user.id;

      // Get teams where the user is a leader
      const teamsLed = await prisma.team.findMany({
        where: {
          leaderId: userId,
        },
        include: {
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      });

      // Get teams where the user is a member
      const teamsMember = await prisma.team.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      });

      res.json({
        led: teamsLed,
        member: teamsMember,
      });
    } catch (error) {
      console.error("Error fetching user teams:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching user teams" });
    }
  },

  // Get all team members with their team information
  getAllTeamMembers: async (_req: Request, res: Response): Promise<void> => {
    try {
      const teamMembers = await prisma.teamMember.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              acro: true,
            },
          },
        },
      });

      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching team members" });
    }
  },

  // Get team members for a specific team
  getTeamMembersByTeamId: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { teamId } = req.params;

      const teamMembers = await prisma.teamMember.findMany({
        where: {
          teamId: Number(teamId),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching team members" });
    }
  },

  // Get teams for a specific user
  getTeamsByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const teamMembers = await prisma.teamMember.findMany({
        where: {
          userId: Number(userId),
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              acro: true,
              description: true,
              leader: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching user's teams:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching user's teams" });
    }
  },
};

export default teamController;
