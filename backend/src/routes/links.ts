import { Hono } from "hono";
import { userAuth } from "@/middleware/user-auth";
import { links } from "@/controllers/links";

const linksRouter = new Hono();


linksRouter.use('/*', userAuth); // Aplica o middleware de autenticação a todas as rotas de links

linksRouter.get("/", links.listLinksHandler);

linksRouter.post("/", links.createLinkHandler);


linksRouter.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `Obter link ${id}` });
});

linksRouter.put("/:id", links.updateLinkHandler);

linksRouter.delete("/:id", links.deleteLinkHandler);
export default linksRouter;