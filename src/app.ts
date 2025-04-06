import express, { Request, Response, NextFunction } from "express";
import { prisma } from "./lib/prisma/prisma";
import { apiV1Router } from "./routes/apiv1";

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route for testing
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to NotionLikeApi application." });
});

// Add routes here later
app.use("/api/v1", apiV1Router);

// Error handling middleware
interface ErrorWithStatus extends Error {
  status?: number;
}

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

export default app;
