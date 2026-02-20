import { Context } from "hono";
import { getUserByEmail } from "@/services/auth";
import { verifyPassword, generateToken } from "@/lib/auht";

export const loginUserHandler = async (c: Context) => {
    // Lógica de autenticação (verificar email e senha)
    const { email, password } = await c.req.json<{ email: string; password: string }>();
    
    const user = await getUserByEmail(email);

    if (!user) {
        return c.json({ error: "Usuário não encontrado" }, 404);
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        return c.json({ error: "Senha inválida" }, 401);
    }

    const token = await generateToken(user.id);

    // se quiser retornar no body:
    return c.json({ token });
};

export const auth = {
    loginUserHandler
}