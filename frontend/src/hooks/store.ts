import { create } from 'zustand';

type State = {
  address: string | null;
};

type Actions = {
  setAddress: (address: string | null) => void;
};

export const useStore = create<State & Actions>((set) => ({
  address: null,
  setAddress: (address) => set({ address }),
}));