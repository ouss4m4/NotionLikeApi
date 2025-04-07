import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/passport";
import { User } from "@prisma/client";

export const authenticateJWT = passport.authenticate("jwt", { session: false });

export const generateToken = (user: User) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const handleLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, user: User, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || "Authentication failed" });
    }
    const token = generateToken(user);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  })(req, res, next);
};
