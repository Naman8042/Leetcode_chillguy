// atoms/inputAtom.ts
import { atom } from 'recoil';

export interface InputState {
  name: string;
  email: string;
  // ...other fields
}

export const inputState = atom<InputState>({
  key: 'inputState', // Unique ID
  default: {
    name: '',
    email: '',
    // ...default values
  },
});