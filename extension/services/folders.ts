import api from './api';

export interface CreateFolderInput {
  name: string;
}

export interface Folder {
  id: string;
  userId: string;
  parentId?: string | null;
  name: string;
  totalLinks: number;
  position: number;
  createdAt: string;
  updatedAt: string;
}

interface FoldersResponse {
  data: Folder[];
}

interface FolderResponse {
  data: Folder | Folder[];
}

export async function getFolders(): Promise<Folder[]> {
  const response = await api.get<Folder[] | FoldersResponse>('/api/folders');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.data ?? [];
}

export async function createFolder(payload: CreateFolderInput): Promise<Folder> {
  const response = await api.post<Folder | FolderResponse>('/api/folders', payload);

  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    const data = response.data.data;
    if (Array.isArray(data)) {
      if (!data[0]) {
        throw new Error('Resposta invalida ao criar pasta');
      }
      return data[0];
    }
    return data;
  }

  return response.data as Folder;
}

export async function deleteFolder(id: string): Promise<void> {
  await api.delete(`/api/folders/${id}`);
}
