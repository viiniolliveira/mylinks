import api from './api';

export interface CreateLinkInput {
  url: string;
  title?: string;
  description?: string;
  faviconUrl?: string;
  userId?: string;
  folderId?: string | null;
}

export type UpdateLinkInput = Partial<CreateLinkInput>;

export interface Link extends CreateLinkInput {
  id: string;
  userId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetLinksParams {
  folderId?: string;
}

interface LinksResponse {
  data: Link[];
}

export async function getLinks(params?: GetLinksParams): Promise<Link[]> {
  const searchParams = new URLSearchParams();

  if (params?.folderId) {
    searchParams.set('folderId', params.folderId);
  }

  const query = searchParams.toString();
  const url = query ? `/api/links?${query}` : '/api/links';
  const response = await api.get<Link[] | LinksResponse>(url);
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.data ?? [];
}

export async function createLink(payload: CreateLinkInput): Promise<Link> {
  const response = await api.post<Link>('/api/links', payload);
  return response.data;
}

export async function deleteLink(id: string): Promise<void> {
  await api.delete(`/api/links/${id}`);
}

export async function updateLink(id: string, payload: UpdateLinkInput): Promise<Link> {
  const response = await api.put<Link>(`/api/links/${id}`, payload);
  return response.data;
}
