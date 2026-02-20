import{ prisma } from '../lib/prisma'

export const getFolders = async (userId: string) => {
  return await prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}


export const getFolderById = async (userId: string, folderId: string) => {
  return await prisma.folder.findFirst({
    where: { 
        id: folderId, 
        userId 
    },
  })
}

export const createFolder = async (userId: string, name: string) => {
  return await prisma.folder.create({
    data: { userId, name },
  })
}

export const deleteFolder = async (userId: string, folderId: string) => {
    const deleteTransaction = await prisma.$transaction(async (prisma) => {
        await prisma.link.deleteMany({
            where: { folderId },
        });
        await prisma.folder.deleteMany({
            where: { id: folderId, userId },
        });
    });
    return deleteTransaction;
}

export const updateFolder = async (userId: string, folderId: string, name: string) => {
  return await prisma.folder.updateMany({
    where: { id: folderId, userId },
    data: { name },
  })
}