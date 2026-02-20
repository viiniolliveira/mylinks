import { Hono } from "hono";

const foldersRouter = new Hono();

foldersRouter.get("/", (c) => {
  return c.json({ message: "Listar pastas" });
});

foldersRouter.post("/", (c) => {
  return c.json({ message: "Criar pasta" });
});

foldersRouter.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `Obter pasta ${id}` });
});

foldersRouter.put("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `Atualizar pasta ${id}` });
});

foldersRouter.delete("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `Deletar pasta ${id}` });
});

export default foldersRouter;