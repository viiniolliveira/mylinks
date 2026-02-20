import { atom } from 'jotai';
import type { Link } from '../../../services/links';

export const isLinkEditModalOpenAtom = atom(false);
export const selectedLinkAtom = atom<Link | null>(null);
