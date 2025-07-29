import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type UserStore = {
  user: Schema<"UserInfoDTO"> | null;
  setUser: (user: Schema<"UserInfoDTO"> | null) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user: Schema<"UserInfoDTO"> | null) => set({ user }),
}));
