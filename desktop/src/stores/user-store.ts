import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { create } from "zustand";

type UserStore = {
  user: Schema<"UserInfoDTO">;
  setUser: (user: Schema<"UserInfoDTO">) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: {
    email: "asd@asd.asd",
    isEmailVerified: true,
    lastName: "asd",
    name: "asd",
    username: "asd",
  } as Schema<"UserInfoDTO">,
  setUser: (user: Schema<"UserInfoDTO">) => set({ user }),
}));
