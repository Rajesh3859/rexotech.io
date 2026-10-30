import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { projectsRouter } from "./routes/projects.js";
import { transcriptsRouter } from "./routes/transcripts.js";
import { exportsRouter } from "./routes/exports.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = process.env.API_PORT || 4000;

// Security & Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", async (_req: Request, res: Response) => {
  try {
    // Quick DB ping
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      status: "ok",
      service: "ai-caption-studio-api",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "DB error";
    return res.status(503).json({
      status: "degraded",
      service: "ai-caption-studio-api",
      database: "disconnected",
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes (v1)
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/transcripts", transcriptsRouter);
app.use("/api/v1/exports", exportsRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "NotFound", message: "Endpoint not found" });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API error:", err);
  res.status(500).json({
    error: "InternalServerError",
    message: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
  });
});

app.listen(PORT, () => {
  console.log(`AI Caption Studio API is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

