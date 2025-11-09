import jwt from "jsonwebtoken";
import { appConfig } from "../configs/appConfig";

const JWT_SECRET =
  appConfig.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRATION = "24h";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
