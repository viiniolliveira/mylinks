import { prisma } from "@/lib/prisma";

interface CreateLinkInput {
  url: string;
  title?: string;
  description?: string;
  faviconUrl?: string;
  userId: string;
  folderId?: string | null;
}

export const getLinks = async (userId: string, folderId?: string) => {
  const links = await prisma.link.findMany({
    where: { userId, folderId: folderId ?? null },
    orderBy: { createdAt: "desc" },
  });
  return links;
};

export const createLink = async (data: CreateLinkInput) => {
  const link = await prisma.link.create({
    data: {
      url: data.url,
      title: data.title,
      description: data.description,
      faviconUrl: data.faviconUrl,
      userId: data.userId,
      folderId: data.folderId || null,
    },
  });
  return link;
};

export const getLinkById = async (id: string) => {
  const link = await prisma.link.findUnique({
    where: { id },
  });
  return link;
};

export const updateLink = async (
  id: string,
  data: Partial<CreateLinkInput>,
) => {
  const link = await prisma.link.update({
    where: { id },
    data: {
      url: data.url,
      title: data.title,
      description: data.description,
      faviconUrl: data.faviconUrl,
      folderId: data.folderId || null,
    },
  });

  if (data.folderId) {
    const totalLinksInFolder = await prisma.link.count({
      where: { folderId: data.folderId },
    });

    if (totalLinksInFolder > 0) {
      await prisma.folder.update({
        where: { id: data.folderId },

        data: {
          totalLinks: totalLinksInFolder,
          updatedAt: new Date(),
        },
      });
    }
  }

  return link;
};

export const deleteLink = async (id: string) => {
  const existingLink = await prisma.link.findFirst({
    where: { id },
    select: { folderId: true },
  });

  if (existingLink?.folderId) {
    await prisma.folder.update({
      where: { id: existingLink.folderId },
      data: {
        totalLinks: {
          decrement: 1,
        },
      },
    });
  }

  await prisma.link.delete({
    where: { id },
  });
};
