import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type TeamStore = {
  activeTeam: Schema<"TeamInfoDTO"> | null;
  setActiveTeam: (team: Schema<"TeamInfoDTO"> | null) => void;
};

export const useTeamStore = create<TeamStore>()((set) => ({
  activeTeam: null,
  setActiveTeam: (team) => set({ activeTeam: team }),
}));
