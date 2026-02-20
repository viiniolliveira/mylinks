import { Hono } from "hono";
import { userAuth } from "@/middleware/user-auth";
import { folders } from "@/controllers/folders";

const foldersRouter = new Hono();

foldersRouter.use("*", userAuth);

foldersRouter.get("/", folders.getFoldersHandler);

foldersRouter.post("/", folders.createFolderHandler);

foldersRouter.get("/:id", folders.getFolderByIdHandler);

foldersRouter.put("/:id", folders.updateFolderHandler);

foldersRouter.delete("/:id", folders.deleteFolderHandler);


export default foldersRouter;