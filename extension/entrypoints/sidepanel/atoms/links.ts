import {
  atomWithMutation,
  atomWithQuery,
  queryClientAtom,
} from "jotai-tanstack-query";
import { atomFamily } from "jotai-family";
import {
  createLink,
  deleteLink,
  getLinks,
  updateLink,
  type CreateLinkInput,
  type UpdateLinkInput,
} from "../../../services/links";

export const linksQueryAtom = atomWithQuery(() => ({
  queryKey: ["links"],
  queryFn: () => getLinks(),
  cacheTime: 1000 * 60 * 5, // 5 minutos
  staleTime: 1000 * 60 * 10, // 10 minutos
}));

export const folderLinksQueryAtomFamily = atomFamily((folderId: string) =>
  atomWithQuery(() => ({
    queryKey: ["links", "folder", folderId],
    queryFn: () => getLinks({ folderId }),
    cacheTime: 1000 * 60 * 5, // 5 minutos
    staleTime: 1000 * 60 * 10, // 10 minutos
  })),
);

export const createLinkMutationAtom = atomWithMutation((get) => ({
  mutationKey: ["create-link"],
  mutationFn: (payload: CreateLinkInput) => createLink(payload),
  onSuccess: (_result, variables) => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["links"] });
    if (variables.folderId) {
      queryClient.invalidateQueries({
        queryKey: ["links", "folder", variables.folderId],
      });
    }
  },
}));

export const deleteLinkMutationAtom = atomWithMutation((get) => ({
  mutationKey: ["delete-link"],
  mutationFn: (id: string) => deleteLink(id),
  onSuccess: () => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["links"] });
    queryClient.invalidateQueries({ queryKey: ["links", "folder"] });
  },
}));

interface UpdateLinkPayload {
  id: string;
  data: UpdateLinkInput;
}

export const updateLinkMutationAtom = atomWithMutation((get) => ({
  mutationKey: ["update-link"],
  mutationFn: ({ id, data }: UpdateLinkPayload) => updateLink(id, data),
  onSuccess: (_result, variables) => {
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["links"] });
    if (variables.data.folderId !== undefined) {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["links", "folder"] });
    }
  },
}));
