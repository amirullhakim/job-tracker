import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret: string = process.env.JWT_SECRET ?? "";

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured.");
}

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

    const userId = Number(decoded.userId);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    req.userId = userId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}