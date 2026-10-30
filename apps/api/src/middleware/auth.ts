import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For local development and test requests with demo user header
    if (process.env.NODE_ENV !== "production" && req.headers["x-demo-user-id"]) {
      req.user = {
        id: req.headers["x-demo-user-id"] as string,
        email: "demo@captionstudio.io",
      };
      return next();
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or invalid authorization token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: error?.message || "Invalid or expired token",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return res.status(500).json({ error: "AuthError", message });
  }
}

