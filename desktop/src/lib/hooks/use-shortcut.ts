import { RefObject } from "react";
import { useEventCallback, useEventListener } from "usehooks-ts";

export type Key =
  | " "
  | "!"
  | '"'
  | "#"
  | "$"
  | "%"
  | "&"
  | "'"
  | "("
  | ")"
  | "*"
  | "+"
  | ","
  | "-"
  | "."
  | "/"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | ":"
  | ";"
  | "<"
  | "="
  | ">"
  | "?"
  | "@"
  | "["
  | "\\"
  | "]"
  | "^"
  | "_"
  | "`"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "{"
  | "|"
  | "}"
  | "~"
  | "Backspace"
  | "Tab"
  | "Enter"
  | "Shift"
  | "Escape";

export function useShortcut({
  callback,
  key,
  ctrlKey,
  ref,
  preventDefault,
  stopPropagation,
  enabled,
}: {
  key: Key;
  ctrlKey?: boolean;
  ref?: RefObject<HTMLElement>;
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}) {
  const event = useEventCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    if (event.key === key && (!ctrlKey || event.ctrlKey)) {
      if (preventDefault) event.preventDefault();

      if (stopPropagation) event.stopPropagation();

      callback(event);
    }
  });

  useEventListener("keydown", event, ref!);
}
