import { createContext, useContext } from "react";

export const slotEditContext = createContext<{
  isEditModeActive: boolean;
}>({
  isEditModeActive: false,
});

export const useIsSlotInEditMode = () =>
  useContext(slotEditContext).isEditModeActive;
