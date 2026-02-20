import { atomWithQuery } from 'jotai-tanstack-query';
import { getFolders } from '../../../services/folders';

export const foldersQueryAtom = atomWithQuery(() => ({
  queryKey: ['folders'],
  queryFn: () => getFolders(),
}));
