import { atomWithMutation, atomWithQuery, queryClientAtom } from 'jotai-tanstack-query';
import { createLink, deleteLink, getLinks, updateLink, type CreateLinkInput, type UpdateLinkInput } from '../../../services/links';

export const linksQueryAtom = atomWithQuery(() => ({
  queryKey: ['links'],
  queryFn: () => getLinks(),
}));

export const createLinkMutationAtom = atomWithMutation((get) => ({
  mutationKey: ['create-link'],
  mutationFn: (payload: CreateLinkInput) => createLink(payload),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ['links'] });
  },
}));

export const deleteLinkMutationAtom = atomWithMutation((get) => ({
  mutationKey: ['delete-link'],
  mutationFn: (id: string) => deleteLink(id),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ['links'] });
  },
}));

interface UpdateLinkPayload {
  id: string;
  data: UpdateLinkInput;
}

export const updateLinkMutationAtom = atomWithMutation((get) => ({
  mutationKey: ['update-link'],
  mutationFn: ({ id, data }: UpdateLinkPayload) => updateLink(id, data),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ['links'] });
  },
}));
