import BaseRoutes from "./BaseRoutes";

import FoodController from "../controllers/FoodController";
import {authMiddleware} from "../middlewares/auth-middleware";

class FoodRoutes extends BaseRoutes{
    public routes():void{
        this.router.get("/", FoodController.index);
        this.router.post("/", authMiddleware, FoodController.create);
        this.router.get("/:uuid", FoodController.show);
        this.router.put("/:uuid", authMiddleware, FoodController.update);
        this.router.delete("/:uuid", authMiddleware, FoodController.delete);
    }
}

export default new FoodRoutes().router;