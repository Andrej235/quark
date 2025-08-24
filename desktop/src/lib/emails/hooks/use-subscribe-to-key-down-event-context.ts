import { KeyboardEvent, useContext, useEffect } from "react";
import { onKeyDownEventContext } from "../contexts/on-key-down-event-context";

export function useSubscribeToKeyDownEventContext(
  id: string,
  callback: (e: KeyboardEvent) => void,
) {
  const onSubscribe = useContext(onKeyDownEventContext).onSubscribe;

  useEffect(() => {
    onSubscribe(id, callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onSubscribe]);
}
