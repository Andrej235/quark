import { KeyboardEvent, useContext, useEffect } from "react";
import { BaseOperation } from "slate";
import { emailEditorEventContext } from "../contexts/on-key-down-event-context";

type Props = {
  id: string;
  onKeyDown?: (event: KeyboardEvent) => void;
  onChange?: (operation?: BaseOperation) => void;
};

export function useSubscribeToEmailEditorEventContext({
  id,
  onKeyDown = () => {},
  onChange = () => {},
}: Props) {
  const onSubscribe = useContext(emailEditorEventContext).onSubscribe;

  useEffect(() => {
    onSubscribe(id, { onKeyDown, onChange });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onSubscribe]);
}
