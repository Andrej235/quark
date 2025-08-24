import { createContext, KeyboardEvent } from "react";
import { BaseOperation } from "slate";

type EmailEditorEventContext = {
  onSubscribe: (
    id: string,
    callbacks: {
      onKeyDown: (event: KeyboardEvent) => void;
      onChange: (operation?: BaseOperation) => void;
    },
  ) => void;
};

export const emailEditorEventContext = createContext<EmailEditorEventContext>({
  onSubscribe: () => {},
});
