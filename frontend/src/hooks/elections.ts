import { create } from "zustand";

export type Election = {
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    status: string;
    id?: number | undefined;
}
export type ElectionT = {
    id: number;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    status: string;
}



export type PalCandidates = {
    id: number;
    name: string;
    political_party: string;
    election_id: number;
}

export type PresCandidates = {
    id: number;
    name: string;
    political_party: string;
    election_id: number;
}

export type ElectionBody = {
    elections: ElectionT,
    pal_candidates: PalCandidates[],
    pres_candidates: PresCandidates[]
}

interface ElectionStore {
    election: Election,
    pal_candidates: {
        name: string;
        political_party: string;
        constituency_id: number;
        id?: number | undefined;
    }[],
    pres_candidates: {
        name: string;
        political_party: string;
        id?: number | undefined;
    }[],
    SetElection: (data: Election) => void,
    appendPalCandidates: (candidates: {
        name: string;
        political_party: string;
        constituency_id: number;
        id?: number | undefined;
    }[]) => void,
    appendPresCandidates: (candidates: {
        name: string;
        political_party: string;
        id?: number | undefined;
    }[]) => void
}

export const useElectionStore = create<ElectionStore>((set, get) => ({
    election: {
        title: "",
        description: "",
        start_time: new Date(),
        end_time: new Date(),
        status: "",
        id: undefined
    },
    pal_candidates: [],
    pres_candidates: [],
    SetElection: (data: Election) => set({ election: data }),
    appendPalCandidates: (candidates) => set((state) => ({
        pal_candidates: [...state.pal_candidates, ...candidates]
    })),
    appendPresCandidates: (candidates) => set((state) => ({
        pres_candidates: [...state.pres_candidates, ...candidates]
    }))
}))