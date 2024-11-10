import BaseRoutes from "./BaseRoutes";

import OrderController from "../controllers/OrderController";
import {authMiddleware} from "../middlewares/auth-middleware";

class OrderRoutes extends BaseRoutes{
    public routes():void{
        this.router.get("/", authMiddleware, OrderController.index);
        this.router.post("/", authMiddleware, OrderController.create);
    }
}

export default new OrderRoutes().router;