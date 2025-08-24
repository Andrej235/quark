import { Braces } from "lucide-react";
import ToolbarButton from "./toolbar-button";
import { useSubscribeToKeyDownEventContext } from "@/lib/emails/hooks/use-subscribe-to-key-down-event-context";

export default function InsertVariableButton() {
  useSubscribeToKeyDownEventContext("insert-variable-button", (e) => {
    console.log(e.key);
  });

  return (
    <>
      <ToolbarButton icon={Braces} name="Insert Variable" />
    </>
  );
}
