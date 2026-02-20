import { atom } from 'jotai';
import type { Folder } from '../../../services/folders';

export const isFolderDeleteModalOpenAtom = atom(false);
export const selectedFolderForDeleteAtom = atom<Folder | null>(null);
