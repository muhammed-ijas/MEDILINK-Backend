import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import SPModel from "../database/service-provider-model";

export const spAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
      
        if (decodedToken.role !== "service_provider") {
            return res.status(400).json({ message: "Unauthorized access" });
        }
  
        const spId = decodedToken.userId; // Assuming userId is used for service providers as well
        const serviceProvider = await SPModel.findById(spId);
  
        if (!serviceProvider) {
            return res.status(400).json({ message: "Service provider not found" });
        }
  
        if (serviceProvider.isBlocked) {
            return res.status(403).json({ message: "Service provider is blocked", accountType: "service_provider" });
        }
  
        next();
    } catch (error: any) {
        console.error("Error decoding token:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};
