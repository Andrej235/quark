import { createContext, useContext } from "react";

export const slotTreeContext = createContext<{
  isEditModeActive: boolean;
  isReadonly: boolean;
}>({
  isEditModeActive: false,
  isReadonly: false,
});

export const useIsSlotInEditMode = () =>
  useContext(slotTreeContext).isEditModeActive;

export const useIsSlotReadonly = () => useContext(slotTreeContext).isReadonly;
