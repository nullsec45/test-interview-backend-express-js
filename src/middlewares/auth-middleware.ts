import { Response, NextFunction } from "express";
import { prismaClient } from "../applications/database";
import { UserRequest } from "../types/UserRequest";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.get("X-API-TOKEN");

  if (!token) {
     res.status(401).json({
      errors: "Unauthorized: Token is missing"
    }); 

    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      token
    }
  });

  if (!user) {
     res.status(401).json({
      errors: "Unauthorized: Invalid token"
    });

    return;
  }

  
  req.user = user;

  next();
};
