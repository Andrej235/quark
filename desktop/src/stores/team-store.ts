import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type TeamStore = {
  activeTeam: Schema<"TeamResponseDto"> | null;
  setActiveTeam: (team: Schema<"TeamResponseDto"> | null) => void;
};

export const useTeamStore = create<TeamStore>()((set) => ({
  activeTeam: null,
  setActiveTeam: (team) => set({ activeTeam: team }),
}));
