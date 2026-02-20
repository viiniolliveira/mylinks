import { Context } from "hono";
import { 
  getFolders, 
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderById
} from "@/services/folders";

const getFoldersHandler = async (c: Context) => {
  const userId = c.get("userId");
  const folders = await getFolders(userId);
  console.log("Folders retrieved:", folders);

  return c.json({ data: folders });
}


const getFolderByIdHandler = async (c: Context) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const folder = await getFolderById(userId, id);

  if (!folder) {
    return c.json({ error: "Folder not found" }, 404);
  }

  return c.json({ data: folder });
}

const createFolderHandler = async (c: Context) => {
  const userId = c.get("userId");
  const { name } = await c.req.json();

  try {
    const newFolder = await createFolder(userId, name);
    return c.json({ data: newFolder }, 201);
  } catch (error) {
    console.error("Error creating folder:", error);
    return c.json({ error: "Failed to create folder" }, 500);
  }
}

const updateFolderHandler = async (c: Context) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const { name } = await c.req.json();

  try {
    const updatedFolder = await updateFolder(userId, id, name);
    if (updatedFolder.count === 0) {
      return c.json({ error: "Folder not found or unauthorized" }, 404);
    }
    return c.json({ data: updatedFolder });
  } catch (error) {
    console.error("Error updating folder:", error);
    return c.json({ error: "Failed to update folder" }, 500);
  }
}

const deleteFolderHandler = async (c: Context) => {
  const userId = c.get("userId");
  const { id } = c.req.param();

  try {
    await deleteFolder(userId, id);
    return c.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return c.json({ error: "Failed to delete folder" }, 500);
  }
}

export const folders = {
  getFoldersHandler,
  createFolderHandler,
  updateFolderHandler,
  deleteFolderHandler,
  getFolderByIdHandler
}