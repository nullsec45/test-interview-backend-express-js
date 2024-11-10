import express from "express";
import { errorMiddleware } from "../middlewares/error-middleware";
import UserRoute from "../routes/UserRoute";
import FoodRoutes from "../routes/FoodRoute";
import OrderRoutes from "../routes/OrderRoutes";

export const server=express();
server.use(express.json());


server.use("/api/v1/users", UserRoute);
server.use("/api/v1/foods", FoodRoutes);
server.use("/api/v1/orders", OrderRoutes);
server.use(errorMiddleware)