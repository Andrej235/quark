import { cn } from "@/lib/cn";
import { useSlateElement } from "@/lib/emails/hooks/use-slate-element";
import { ChevronDown, List, ListOrdered } from "lucide-react";
import { Editor, Element, Path, Transforms } from "slate";
import { useSlate } from "slate-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Toggle } from "../../ui/toggle";

export default function ListDropdown() {
  const editor = useSlate();

  const [unorderedList, ulLocation] = useSlateElement("unordered-list");
  const [orderedList, olLocation] = useSlateElement("ordered-list");

  const selected: "ul" | "ol" | null = unorderedList
    ? "ul"
    : orderedList
      ? "ol"
      : null;

  function handleChange($new: "ul" | "ol" | null) {
    toggleList($new);
  }

  function wrapInListOrMerge(listType: "ul" | "ol") {
    const type = listType === "ul" ? "unordered-list" : "ordered-list";
    const { selection } = editor;
    if (!selection) return;

    Transforms.setNodes(editor, { type: "list-item" });
    Transforms.wrapNodes(editor, { type, children: [] });

    // Get the path of the newly created list
    const [newListNode, newListPath] = Editor.above(editor, {
      match: (n) => Element.isElement(n) && n.type === type,
    }) || [null, null];

    if (!newListNode || !newListPath) return;

    const parentPath = Path.parent(newListPath);
    const parentNode = Editor.node(editor, parentPath)[0] as Element;
    const index = newListPath[newListPath.length - 1];

    const prevNode = parentNode.children[index - 1];
    const nextNode = parentNode.children[index + 1];

    // Merge with previous if same type
    if (prevNode && Element.isElement(prevNode) && prevNode.type === type) {
      Transforms.mergeNodes(editor, { at: newListPath });
    }

    // Merge with next if same type
    if (nextNode && Element.isElement(nextNode) && nextNode.type === type) {
      Transforms.mergeNodes(editor, { at: newListPath });
    }
  }

  function toggleList(listType: "ul" | "ol" | null) {
    // Base case, no changes
    if (listType === selected) return;

    // === Unwrap case ===
    if (selected && !listType) {
      const location = selected === "ul" ? ulLocation : olLocation;
      if (!location) return;

      // Unwrap the paragraph from the list
      Transforms.unwrapNodes(editor, {
        split: true,
        match: (n) =>
          Element.isElement(n) &&
          (n.type === "unordered-list" || n.type === "ordered-list"),
      });

      Transforms.setNodes(editor, { type: "paragraph" });
      return;
    }

    // === New list case ===
    if (!selected && listType) {
      wrapInListOrMerge(listType);
      Transforms.setNodes(editor, { type: "list-item" });
      return;
    }

    // === Switch list type case ===
    if (selected && listType) {
      const fromLocation = selected === "ul" ? ulLocation : olLocation;
      if (!fromLocation) return;

      // Unwrap the selection from the list
      Transforms.unwrapNodes(editor, {
        split: true,
        match: (n) =>
          Element.isElement(n) &&
          (n.type === "unordered-list" || n.type === "ordered-list"),
      });

      // Wrap that li in a new list of the target type
      wrapInListOrMerge(listType);
    }
  }

  return (
    <DropdownMenu>
      <div
        className={cn(
          "hover:border-border hover:bg-accent rounded-md border border-transparent pr-1 transition-colors",
          selected && "bg-accent",
        )}
      >
        <Toggle
          pressed={!!selected}
          onPressedChange={(pressed) => handleChange(pressed ? "ul" : null)}
        >
          {selected === "ol" ? <ListOrdered /> : <List />}
        </Toggle>

        <DropdownMenuTrigger>
          <ChevronDown className="text-muted-foreground size-4 opacity-50" />
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleChange("ul")}>
          <List />
          <span>Bullet List</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleChange("ol")}>
          <ListOrdered />
          <span>Numbered List</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
