import { atomWithMutation } from 'jotai-tanstack-query';
import { login, type LoginPayload } from '../../../services/auth';

export const loginMutationAtom = atomWithMutation(() => ({
  mutationKey: ['login'],
  mutationFn: (payload: LoginPayload) => login(payload),
}));
