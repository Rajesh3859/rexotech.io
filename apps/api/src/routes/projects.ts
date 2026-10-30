import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { ProjectStatus } from "@prisma/client";

export const projectsRouter = Router();

// Zod validation schemas
const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be under 120 characters"),
  aspectRatio: z.enum(["9:16", "16:9", "1:1"]).default("9:16"),
  language: z.string().default("en"),
  originalVideoUrl: z.string().url("Must be a valid video URL").optional().or(z.literal("")),
  durationSeconds: z.number().nonnegative().optional(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
});

const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  aspectRatio: z.enum(["9:16", "16:9", "1:1"]).optional(),
  language: z.string().optional(),
  originalVideoUrl: z.string().url().optional().or(z.literal("")),
  durationSeconds: z.number().nonnegative().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
});

// Helper: Ensure user record exists in database
async function ensureUserExists(userId: string, email?: string) {
  return prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: email || `user-${userId}@captionstudio.io`,
    },
  });
}

// ---------------------------------------------------------
// 1. POST /api/v1/projects - Create a new project
// ---------------------------------------------------------
projectsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const validation = createProjectSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid project parameters",
        details: validation.error.flatten(),
      });
    }

    const { title, aspectRatio, language, originalVideoUrl, durationSeconds, status } = validation.data;

    await ensureUserExists(userId, req.user!.email);

    const project = await prisma.project.create({
      data: {
        userId, // Strictly enforce ownership
        title,
        aspectRatio,
        language,
        originalVideoUrl: originalVideoUrl || null,
        durationSeconds: durationSeconds ?? null,
        status,
      },
      include: {
        transcript: true,
        exports: true,
      },
    });

    return res.status(201).json({
      success: true,
      project,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return res.status(500).json({ error: "CreateProjectError", message });
  }
});

// ---------------------------------------------------------
// 2. GET /api/v1/projects - List all projects for authenticated user
// ---------------------------------------------------------
projectsRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, search, limit = "20", page = "1" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Build ownership-enforced filter
    const whereClause: {
      userId: string;
      status?: ProjectStatus;
      title?: { contains: string; mode: "insensitive" };
    } = {
      userId, // Strictly filter by authenticated user's ID
    };

    if (status && Object.values(ProjectStatus).includes(status as ProjectStatus)) {
      whereClause.status = status as ProjectStatus;
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      whereClause.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        include: {
          transcript: {
            select: {
              id: true,
              accuracy: true,
              createdAt: true,
            },
          },
          _count: {
            select: { exports: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.project.count({ where: whereClause }),
    ]);

    return res.json({
      success: true,
      projects,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return res.status(500).json({ error: "FetchProjectsError", message });
  }
});

// ---------------------------------------------------------
// 3. GET /api/v1/projects/:id - Retrieve a single project
// ---------------------------------------------------------
projectsRouter.get("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        transcript: true,
        exports: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "NotFound",
        message: "Project not found",
      });
    }

    // Ownership Enforcement
    if (project.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to access this project",
      });
    }

    return res.json({
      success: true,
      project,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch project";
    return res.status(500).json({ error: "FetchProjectError", message });
  }
});

// ---------------------------------------------------------
// 4. PATCH /api/v1/projects/:id - Update an existing project
// ---------------------------------------------------------
projectsRouter.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const validation = updateProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid update parameters",
        details: validation.error.flatten(),
      });
    }

    // Check project existence
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({
        error: "NotFound",
        message: "Project not found",
      });
    }

    // Ownership Enforcement
    if (existingProject.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to modify this project",
      });
    }

    const { title, aspectRatio, language, originalVideoUrl, durationSeconds, status } = validation.data;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(aspectRatio !== undefined && { aspectRatio }),
        ...(language !== undefined && { language }),
        ...(originalVideoUrl !== undefined && { originalVideoUrl: originalVideoUrl || null }),
        ...(durationSeconds !== undefined && { durationSeconds }),
        ...(status !== undefined && { status }),
      },
      include: {
        transcript: true,
        exports: true,
      },
    });

    return res.json({
      success: true,
      project: updatedProject,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return res.status(500).json({ error: "UpdateProjectError", message });
  }
});

// ---------------------------------------------------------
// 5. DELETE /api/v1/projects/:id - Delete a project
// ---------------------------------------------------------
projectsRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    // Check project existence
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({
        error: "NotFound",
        message: "Project not found",
      });
    }

    // Ownership Enforcement
    if (existingProject.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to delete this project",
      });
    }

    // Cascade deletion of project (Prisma schema has onDelete: Cascade for transcript and exports)
    await prisma.project.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Project deleted successfully",
      id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return res.status(500).json({ error: "DeleteProjectError", message });
  }
});
