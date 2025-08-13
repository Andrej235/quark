import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type UserStore = {
  user: Schema<"UserResponseDto"> | null;
  setUser: (user: Schema<"UserResponseDto"> | null) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user: Schema<"UserResponseDto"> | null) => set({ user }),
}));
