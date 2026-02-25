import { Hono } from "hono";
import { logger } from "hono/logger";
import authRouter from "./routes/auth";
import linksRouter from "./routes/links";
import foldersRouter from "./routes/folders";
import { createAdmin, runMigrations } from "../prisma/start-process";

const app = new Hono().basePath("/api");

app.use(logger());

async function bootstrap() {
  runMigrations();
  await createAdmin();
  app.route("/auth", authRouter);
  app.route("/links", linksRouter);
  app.route("/folders", foldersRouter);
}

bootstrap().catch((err) => {
  console.error("Erro no bootstrap:", err);
  process.exit(1);
});

export default {
  port: 8000,
  fetch: app.fetch,
};
