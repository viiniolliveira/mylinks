import { prisma } from "@/lib/prisma";

const USER_EMAIL = process.env.SEED_USER_EMAIL!
const USER_PASSWORD = process.env.SEED_USER_PASSWORD!

interface CreateLinkInput {
    url: string;
    title?: string;
    description?: string;
    faviconUrl?: string;
    userId: string;
    folderId?: string | null;
}


async function main() {
    
    await prisma.user.deleteMany() // limpa a tabela antes de criar o usuário
    await prisma.link.deleteMany() // limpa a tabela antes de criar os links
    console.log("Criando usuário de teste...");
    
    const user = await prisma.user.create({
        data: {
            email: USER_EMAIL,
            password: await Bun.password.hash(USER_PASSWORD)
        }
    })
    console.log("Usuário criado com sucesso!");

    const seedLinks: CreateLinkInput[] = [
        {
            url: "https://www.google.com",
            title: "Google",
            description: "O maior buscador da internet",
            faviconUrl: "https://www.google.com/favicon.ico",
            userId: user.id
        },
        {
            url: "https://www.facebook.com",
            title: "Facebook",
            description: "A maior rede social do mundo",
            faviconUrl: "https://www.facebook.com/favicon.ico",
            userId: user.id
        },
        {
            url: "https://www.youtube.com",
            title: "YouTube",
            description: "A maior plataforma de vídeos do mundo",
            faviconUrl: "https://www.youtube.com/favicon.ico",
            userId: user.id
        },
        {
            url: "https://www.twitter.com",
            title: "Twitter",
            description: "A rede social do passarinho azul",
            faviconUrl: "https://www.twitter.com/favicon.ico",
            userId: user.id
        },
        {
            url: "https://www.linkedin.com",
            title: "LinkedIn",
            description: "A maior rede social profissional do mundo", 
            faviconUrl: "https://www.linkedin.com/favicon.ico",
            userId: user.id
        }
    ]  

    console.log("Criando links de teste...");

    for (const linkData of seedLinks) {
        await prisma.link.create({
            data: linkData
        })
    }
    console.log("Links criados com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });