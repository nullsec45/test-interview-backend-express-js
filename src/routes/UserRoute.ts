import BaseRoutes from "./BaseRoutes";

import UserController from "../controllers/UserController";
import {authMiddleware} from "../middlewares/auth-middleware";

class UserRoutes extends BaseRoutes{
    public routes():void{
        this.router.post("/auth/login", UserController.login);
        this.router.post("/auth/register", UserController.register);
    }
}

export default new UserRoutes().router;