import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type TeamInvitationsStore = {
  invitations: Schema<"UserTeamInvitationResponseDto">[];
  setInvitations: (
    invitations: Schema<"UserTeamInvitationResponseDto">[],
  ) => void;
  addInvitation: (invitation: Schema<"UserTeamInvitationResponseDto">) => void;
};

export const useTeamInvitationsStore = create<TeamInvitationsStore>((set) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitation: (invitation) =>
    set((state) => ({
      invitations: [...state.invitations, invitation],
    })),
}));
