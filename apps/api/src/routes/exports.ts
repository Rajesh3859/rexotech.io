import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

export const exportsRouter = Router();

const createExportSchema = z.object({
  projectId: z.string().uuid("Valid project ID required"),
  stylePreset: z.string().default("High Contrast Bold"),
  resolution: z.enum(["720p", "1080p", "4k"]).default("1080p"),
});

exportsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = createExportSchema.parse(req.body);

    const project = await prisma.project.findFirst({
      where: { id: body.projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ error: "NotFound", message: "Project not found" });
    }

    const exportRecord = await prisma.export.create({
      data: {
        projectId: project.id,
        stylePreset: body.stylePreset,
        resolution: body.resolution,
        status: "COMPLETED",
        downloadUrl: `https://storage.captionstudio.io/renders/${project.id}-${Date.now()}.mp4`,
      },
    });

    return res.status(201).json({
      success: true,
      export: exportRecord,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "ValidationError", details: error.flatten() });
    }
    const message = error instanceof Error ? error.message : "Failed to create export";
    return res.status(500).json({ error: "ExportError", message });
  }
});

