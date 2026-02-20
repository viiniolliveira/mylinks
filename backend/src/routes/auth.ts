import { Hono } from "hono";
import { auth } from "../controllers/auth";

const authRouter = new Hono();

authRouter.post("/login", auth.loginUserHandler);

export default authRouter;