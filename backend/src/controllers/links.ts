import { Context } from "hono";
import {
  getLinks,
  createLink,
  deleteLink,
  updateLink,
  getLinkById,
} from "../services/links";

export const listLinksHandler = async (c: Context) => {
  const userId = c.get("userId");

  const folderId = c.req.query("folderId") || undefined;
  const links = await getLinks(userId, folderId);

  return c.json({ data: links });
};

export const getLinkHandler = async (c: Context) => {
  const { id } = c.req.param();
  const link = await getLinkById(id);

  if (!link) {
    return c.json({ error: "Link not found" }, 404);
  }

  return c.json({ data: link });
};

export const createLinkHandler = async (c: Context) => {
  const userId = c.get("userId");
  const { url, title, description, faviconUrl, folderId } = await c.req.json();

  try {
    const newLink = await createLink({
      url,
      title,
      description,
      faviconUrl,
      userId,
      folderId,
    });
    return c.json({ data: newLink }, 201);
  } catch (error) {
    console.error("Erro ao criar link:", error);
    return c.json({ error: "Failed to create link" }, 500);
  }
};

export const updateLinkHandler = async (c: Context) => {
  const { id } = c.req.param();
  const { url, title, description, faviconUrl, folderId } = await c.req.json();

  try {
    const updatedLink = await updateLink(id, {
      url,
      title,
      description,
      faviconUrl,
      folderId,
    });
    return c.json({ data: updatedLink });
  } catch (error) {
    console.error("Erro ao atualizar link:", error);
    return c.json({ error: "Failed to update link" }, 500);
  }
};

export const deleteLinkHandler = async (c: Context) => {
  const { id } = c.req.param();
  console.log(`Deletando link com id: ${id}`);

  try {
    await deleteLink(id);
    return c.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    return c.json({ error: "Failed to delete link" }, 500);
  }
};

export const links = {
  listLinksHandler,
  createLinkHandler,
  deleteLinkHandler,
  updateLinkHandler,
  getLinkHandler,
};
