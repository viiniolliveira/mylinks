import { atomWithMutation, atomWithQuery, queryClientAtom } from 'jotai-tanstack-query';
import { createFolder, deleteFolder, getFolders, updateFolder, type CreateFolderInput } from '../../../services/folders';

export const foldersQueryAtom = atomWithQuery(() => ({
  queryKey: ['folders'],
  queryFn: () => getFolders(),
  cacheTime: 1000 * 60 * 10, // 10 minutos
  staleTime: 1000 * 60 * 10, // 10 minutos
}));

export const createFolderMutationAtom = atomWithMutation((get) => ({
  mutationKey: ['create-folder'],
  mutationFn: (payload: CreateFolderInput) => createFolder(payload),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ['folders'] });
  },
}));

export const updateFolderMutationAtom = atomWithMutation((get) => ({
  mutationKey: ['update-folder'],
  mutationFn: ({ id, payload }: { id: string; payload: CreateFolderInput }) => updateFolder(id, payload),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ['folders'] });
  },
}));

export const deleteFolderMutationAtom = atomWithMutation((get) => ({
  mutationKey: ['delete-folder'],
  mutationFn: (id: string) => deleteFolder(id),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ['folders'] });
  },
}));
