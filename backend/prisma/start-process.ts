import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";

const USER_EMAIL = process.env.USER_EMAIL!;
const USER_PASSWORD = process.env.USER_PASSWORD!;

export async function createAdmin() {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: USER_EMAIL,
    },
  });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: USER_EMAIL,
        password: await Bun.password.hash(USER_PASSWORD),
        role: "ADMIN",
      },
    });
    console.log("Usuário admin criado com sucesso!");
    return;
  } else {
    console.log("Usuário admin já existe.");
  }
}



export function runMigrations() {
  execSync("bunx prisma migrate deploy", { stdio: "inherit" });
}