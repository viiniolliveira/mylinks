import api from './api';

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

export async function getFolders(): Promise<Folder[]> {
  const response = await api.get<Folder[] | FoldersResponse>('/api/folders');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.data ?? [];
}
