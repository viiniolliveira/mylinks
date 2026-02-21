import { atom } from 'jotai';
import type { Folder } from '../../../services/folders';

export const isFolderEditModalOpenAtom = atom(false);
export const selectedFolderForEditAtom = atom<Folder | null>(null);
