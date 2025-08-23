import { useEffect, useState } from "react";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export default function InsertEmailDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const editor = useSlate();
  const [input, setInput] = useState({ text: "", email: "" });

  useEffect(() => {
    const selectedText = editor.selection
      ? Editor.string(editor, editor.selection)
      : "";

    setInput({
      text: selectedText,
      email: "",
    });
  }, [open, editor]);

  function handleInsert() {
    const { text, email } = input;
    if (!text || !email) return;

    const currentMarks = Editor.marks(editor);

    Transforms.insertNodes(editor, {
      type: "email-address",
      email,
      children: [
        {
          text: text || email,
          italic: true,
          underline: true,
          ...currentMarks,
        },
      ],
    });

    Transforms.collapse(editor, { edge: "end" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Email</DialogTitle>
          <DialogDescription>
            Please enter the text and email address for the email link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="text">Text</Label>

          <Input
            id="text"
            placeholder="Text"
            value={input.text}
            onChange={(e) => setInput({ ...input, text: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            placeholder="Email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleInsert}>Insert Email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
