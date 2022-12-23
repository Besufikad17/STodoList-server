import { Router } from "express";
import { UserController } from "../controllers/userController";

const route = Router();
const userController = new UserController();

route.post("/signup", userController.signup);
route.post("/login", userController.login);

route.get("/todos/:id", userController.getTodosById);
route.get("/export/:id", userController.exportTodo);

route.put("/update/:id", userController.updateTodo);

export { route }