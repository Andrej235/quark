import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type TeamInvitationsStore = {
  invitations: Schema<"TeamInvitationResponseDto">[];
  setInvitations: (invitations: Schema<"TeamInvitationResponseDto">[]) => void;
  addInvitation: (invitation: Schema<"TeamInvitationResponseDto">) => void;
  removeInvitation: (id: string) => void;
};

export const useTeamInvitationsStore = create<TeamInvitationsStore>((set) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitation: (invitation) =>
    set((state) => ({
      invitations: [...state.invitations, invitation],
    })),
  removeInvitation: (id) =>
    set((state) => ({
      invitations: state.invitations.filter(
        (invitation) => invitation.id !== id,
      ),
    })),
}));
