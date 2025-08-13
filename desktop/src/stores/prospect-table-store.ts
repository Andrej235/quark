import { create } from "zustand";

type ProspectTableStore = {
  pageIndex: number;
  setPageIndex: (newPageIndex: number) => void;
  pageCursors: string[];
  addCursor: (cursor: string) => void;
  clearCursors: () => void;
  currentCursor: string | null;
};

export const useProspectTableStore = create<ProspectTableStore>()((set) => ({
  pageIndex: 0,
  currentCursor: null,
  pageCursors: [],

  setPageIndex: (newPageIndex: number) =>
    set((x) => ({
      pageIndex: newPageIndex,
      currentCursor:
        newPageIndex < 1 ? null : (x.pageCursors[newPageIndex - 1] ?? null),
    })),
  addCursor: (cursor: string) =>
    set((state) =>
      state.pageCursors.includes(cursor)
        ? state
        : { pageCursors: [...state.pageCursors, cursor] },
    ),
  clearCursors: () => set({ pageCursors: [], currentCursor: null }),
}));
