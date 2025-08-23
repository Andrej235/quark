import { useEffect, useState } from "react";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function EmailTemplateInsertLink({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const editor = useSlate();
  const [link, setLink] = useState({ text: "", url: "" });

  useEffect(() => {
    const selectedText = editor.selection
      ? Editor.string(editor, editor.selection)
      : "";

    setLink({
      text: selectedText,
      url: "",
    });
  }, [open, editor]);

  function handleInsert() {
    const { text, url } = link;
    if (!text || !url) return;

    Transforms.insertNodes(editor, {
      type: "link",
      url,
      children: [
        {
          text: text || url,
          italic: true,
          underline: true,
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
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>
            Please enter the text and URL for the link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="link-text">Link Text</Label>

          <Input
            id="link-text"
            placeholder="Link text"
            value={link.text}
            onChange={(e) => setLink({ ...link, text: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link-url">Link URL</Label>

          <Input
            id="link-url"
            placeholder="Link URL"
            value={link.url}
            onChange={(e) => setLink({ ...link, url: e.target.value })}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleInsert}>Insert Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
