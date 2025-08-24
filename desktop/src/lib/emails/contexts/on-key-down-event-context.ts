import { createContext, KeyboardEvent } from "react";

type OnKeyDownEventContext = {
  onSubscribe: (id: string, callback: (event: KeyboardEvent) => void) => void;
};

export const onKeyDownEventContext = createContext<OnKeyDownEventContext>({
  onSubscribe: () => {},
});
