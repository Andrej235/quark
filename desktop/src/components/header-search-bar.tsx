import { useShortcut } from "@/hooks/use-shortcut";
import { LucideSearch } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

export default function HeaderSearchBar() {
  const [isActive, setIsActive] = useState(false);
  const alertDialogRef = useRef<HTMLDivElement>(null!);
  useOnClickOutside(alertDialogRef, () => setIsActive(false));

  useShortcut({
    key: "/",
    callback: () => setIsActive(true),
    preventDefault: true,
  });

  return (
    <AlertDialog open={isActive} onOpenChange={setIsActive}>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: "outline",
          className:
            "md:w-196 md:max-w-2/5 ml-auto flex items-center gap-2 md:size-auto md:justify-start",
        })}
      >
        <LucideSearch />

        <span className="text-muted-foreground hidden text-sm md:block">
          Press / to search
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-4" ref={alertDialogRef}>
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>Search</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="border-input relative flex items-center justify-between rounded-md border-2 pl-4">
          <LucideSearch size={24} />

          <Input
            placeholder="Search"
            className="border-0! ring-0! h-12 w-full"
            autoFocus
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
